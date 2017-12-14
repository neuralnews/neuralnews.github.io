# Copyright 2015 Google Inc. All Rights Reserved.
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
"""Cloud Pub/Sub subscription modify-push-config command."""
from googlecloudsdk.api_lib.pubsub import subscriptions
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.pubsub import util


class ModifyPushConfig(base.Command):
  """Modifies the push configuration of a Cloud Pub/Sub subscription."""

  @staticmethod
  def Args(parser):
    """Registers flags for this command."""

    parser.add_argument('subscription',
                        help='Name of the subscription to modify.')
    parser.add_argument(
        '--push-endpoint', required=True,
        help=('A URL to use as the endpoint for this subscription.'
              ' This will also automatically set the subscription'
              ' type to PUSH.'))

  def Run(self, args):
    """This is what gets called when the user runs this command.

    Args:
      args: an argparse namespace. All the arguments that were provided to this
        command invocation.

    Returns:
      None
    """
    client = subscriptions.SubscriptionsClient()

    subscription_ref = util.ParseSubscription(args.subscription)
    push_config = util.ParsePushConfig(args.push_endpoint)
    client.ModifyPushConfig(subscription_ref, push_config)

    return {'subscriptionId': subscription_ref.RelativeName(),
            'pushEndpoint': args.push_endpoint}
