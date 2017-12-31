# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Command for creating instance templates running Docker images."""
from googlecloudsdk.api_lib.compute import base_classes
from googlecloudsdk.api_lib.compute import containers_utils
from googlecloudsdk.api_lib.compute import image_utils
from googlecloudsdk.api_lib.compute import instance_template_utils
from googlecloudsdk.api_lib.compute import instance_utils
from googlecloudsdk.api_lib.compute import metadata_utils
from googlecloudsdk.api_lib.compute import utils
from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions
from googlecloudsdk.command_lib.compute import flags
from googlecloudsdk.command_lib.compute.instance_templates import flags as instance_templates_flags
from googlecloudsdk.command_lib.compute.instances import flags as instances_flags
from googlecloudsdk.core import log


def _Args(parser):
  """Add flags shared by all release tracks."""
  parser.display_info.AddFormat(instance_templates_flags.DEFAULT_LIST_FORMAT)
  metadata_utils.AddMetadataArgs(parser)
  instances_flags.AddDiskArgs(parser)
  instances_flags.AddCreateDiskArgs(parser)
  instances_flags.AddLocalSsdArgsWithSize(parser)
  instances_flags.AddCanIpForwardArgs(parser)
  instances_flags.AddAddressArgs(parser, instances=False)
  instances_flags.AddMachineTypeArgs(parser)
  instances_flags.AddMaintenancePolicyArgs(parser)
  instances_flags.AddNoRestartOnFailureArgs(parser)
  instances_flags.AddPreemptibleVmArgs(parser)
  instances_flags.AddServiceAccountAndScopeArgs(parser, False)
  instances_flags.AddTagsArgs(parser)
  instances_flags.AddCustomMachineTypeArgs(parser)
  instances_flags.AddNetworkArgs(parser)
  instances_flags.AddKonletArgs(parser)
  instances_flags.AddImageArgs(parser)
  instances_flags.AddMinCpuPlatformArgs(parser, base.ReleaseTrack.ALPHA)

  flags.AddRegionFlag(
      parser,
      resource_type='instance template',
      operation_type='create')

  parser.add_argument(
      '--description',
      help='Specifies a textual description for the instance template.')

  CreateWithContainer.InstanceTemplateArg = (
      instance_templates_flags.MakeInstanceTemplateArg())
  CreateWithContainer.InstanceTemplateArg.AddArgument(
      parser, operation_type='create')


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class CreateWithContainer(base.CreateCommand):
  """Command for creating VM instance templates hosting Docker images."""

  @staticmethod
  def Args(parser):
    _Args(parser)

    instances_flags.AddNetworkTierArgs(parser, instance=True)

  def Run(self, args):
    """Issues an InstanceTemplates.Insert request.

    Args:
      args: the argparse arguments that this command was invoked with.

    Returns:
      an InstanceTemplate message object
    """
    holder = base_classes.ComputeApiHolder(self.ReleaseTrack())
    client = holder.client

    instances_flags.ValidateKonletArgs(args)
    instances_flags.ValidateDiskCommonFlags(args)
    instances_flags.ValidateLocalSsdFlags(args)
    instances_flags.ValidateServiceAccountAndScopeArgs(args)
    instances_flags.ValidateNetworkTierArgs(args, support_network_tier=True)
    if instance_utils.UseExistingBootDisk(args.disk or []):
      raise exceptions.InvalidArgumentException(
          '--disk',
          'Boot disk specified for containerized VM.')

    boot_disk_size_gb = utils.BytesToGb(args.boot_disk_size)
    utils.WarnIfDiskSizeIsTooSmall(boot_disk_size_gb, args.boot_disk_type)

    instance_template_ref = (
        CreateWithContainer.InstanceTemplateArg.ResolveAsResource(
            args, holder.resources))

    user_metadata = metadata_utils.ConstructMetadataMessage(
        client.messages,
        metadata=args.metadata,
        metadata_from_file=args.metadata_from_file)
    containers_utils.ValidateUserMetadata(user_metadata)

    network_interface = instance_template_utils.CreateNetworkInterfaceMessage(
        resources=holder.resources,
        scope_lister=flags.GetDefaultScopeLister(client),
        messages=client.messages,
        network=args.network,
        region=args.region,
        subnet=args.subnet,
        address=(instance_template_utils.EPHEMERAL_ADDRESS
                 if not args.no_address and not args.address
                 else args.address),
        network_tier=getattr(args, 'network_tier', None))

    scheduling = instance_utils.CreateSchedulingMessage(
        messages=client.messages,
        maintenance_policy=args.maintenance_policy,
        preemptible=args.preemptible,
        restart_on_failure=args.restart_on_failure)

    if args.no_service_account:
      service_account = None
    else:
      service_account = args.service_account
    service_accounts = instance_utils.CreateServiceAccountMessages(
        messages=client.messages,
        scopes=[] if args.no_scopes else args.scopes,
        service_account=service_account)

    if (args.IsSpecified('image') or args.IsSpecified('image_family') or
        args.IsSpecified('image_project')):
      image_expander = image_utils.ImageExpander(client, holder.resources)
      image_uri, _ = image_expander.ExpandImageFlag(
          user_project=instance_template_ref.project,
          image=args.image,
          image_family=args.image_family,
          image_project=args.image_project)
      if holder.resources.Parse(image_uri).project != 'cos-cloud':
        log.warn('This container deployment mechanism requires a '
                 'Container-Optimized OS image in order to work. Select an '
                 'image from a cos-cloud project (cost-stable, cos-beta, '
                 'cos-dev image families).')
    else:
      image_uri = containers_utils.ExpandKonletCosImageFlag(client)

    machine_type = instance_utils.InterpretMachineType(
        machine_type=args.machine_type,
        custom_cpu=args.custom_cpu,
        custom_memory=args.custom_memory,
        ext=getattr(args, 'custom_extensions', None))

    metadata = containers_utils.CreateKonletMetadataMessage(
        client.messages, args, instance_template_ref.Name(), user_metadata)

    request = client.messages.ComputeInstanceTemplatesInsertRequest(
        instanceTemplate=client.messages.InstanceTemplate(
            properties=client.messages.InstanceProperties(
                machineType=machine_type,
                disks=self._CreateDiskMessages(holder, args, boot_disk_size_gb,
                                               image_uri,
                                               instance_template_ref.project),
                canIpForward=args.can_ip_forward,
                metadata=metadata,
                minCpuPlatform=args.min_cpu_platform,
                networkInterfaces=[network_interface],
                serviceAccounts=service_accounts,
                scheduling=scheduling,
                tags=containers_utils.CreateTagsMessage(
                    client.messages, args.tags),
            ),
            description=args.description,
            name=instance_template_ref.Name(),
        ),
        project=instance_template_ref.project)

    return client.MakeRequests([(client.apitools_client.instanceTemplates,
                                 'Insert', request)])

  def _CreateDiskMessages(self, holder, args, boot_disk_size_gb, image_uri,
                          project):
    """Creates API messages with disks attached to VM instance."""
    persistent_disks = (
        instance_template_utils.CreatePersistentAttachedDiskMessages(
            holder.client.messages, args.disk or []))
    boot_disk_list = [
        instance_template_utils.CreateDefaultBootAttachedDiskMessage(
            messages=holder.client.messages,
            disk_type=args.boot_disk_type,
            disk_device_name=args.boot_disk_device_name,
            disk_auto_delete=args.boot_disk_auto_delete,
            disk_size_gb=boot_disk_size_gb,
            image_uri=image_uri)]
    persistent_create_disks = (
        instance_template_utils.CreatePersistentCreateDiskMessages(
            holder.client, holder.resources, project,
            getattr(args, 'create_disk', [])))
    local_ssds = []
    for x in args.local_ssd or []:
      local_ssd = instance_utils.CreateLocalSsdMessage(
          holder.resources,
          holder.client.messages,
          x.get('device-name'),
          x.get('interface'),
          x.get('size'))
      local_ssds.append(local_ssd)
    return (boot_disk_list + persistent_disks +
            persistent_create_disks + local_ssds)


@base.Hidden
@base.ReleaseTracks(base.ReleaseTrack.BETA)
class CreateWithContainerBeta(CreateWithContainer):

  @staticmethod
  def Args(parser):
    _Args(parser)


CreateWithContainer.detailed_help = {
    'brief':
        """\
    Creates Google Compute Engine virtual machine instance template running
    Docker images.
    """,
    'DESCRIPTION':
        """\
        *{command}* creates a Google Compute Engine virtual
        machine instance template that runs a container image. For example:

          $ {command} instance-template-1 \
             --container-image=gcr.io/google-containers/busybox

        creates an instance template that runs the 'busybox' image.
        The created instance template will have the name
        'instance-template-1'

        For more examples, refer to the *EXAMPLES* section below.
        """,
    'EXAMPLES':
        """\
        To create a template named 'instance-template-1' that runs the
        gcr.io/google-containers/busybox image and executes 'echo "Hello world"'
        as a command, run:

          $ {command} instance-template-1 \
            --container-image=gcr.io/google-containers/busybox \
            --container-command='echo "Hello world"'

        To create a template running gcr.io/google-containers/busybox in
        privileged mode, run:

          $ {command} instance-template-1 \
            --container-image=gcr.io/google-containers/busybox \
            --container-privileged
        """
}
