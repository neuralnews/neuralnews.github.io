# Copyright 2016 Google Inc. All Rights Reserved.
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
"""Cloud Pub/Sub subscriptions update command."""
from googlecloudsdk.api_lib.pubsub import subscriptions
from googlecloudsdk.api_lib.util import exceptions
from googlecloudsdk.calliope import arg_parsers
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.pubsub import util
from googlecloudsdk.core import log


def _Duration():
  """Returns a function that can parse time duration args.

  This is an extension of googlecloudsdk.calliope.arg_parsers.Duration() to
  a) Format the result as expected for a Duration proto field, and
  b) Allow for a special default string value.

  Raises:
    An ArgumentTypeError if the input cannot be parsed.

  Returns:
    A function that accepts a single time duration as input to be parsed.
  """
  def ParseWithDefault(value):
    if value == subscriptions.DEFAULT_MESSAGE_RETENTION_VALUE:
      return subscriptions.DEFAULT_MESSAGE_RETENTION_VALUE
    return util.FormatDuration(arg_parsers.Duration()(value))

  return ParseWithDefault


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class UpdateAlpha(base.UpdateCommand):
  """This feature is part of an invite-only release of the Cloud Pub/Sub API.

  Updates an existing Cloud Pub/Sub subscription.
  This feature is part of an invitation-only release of the underlying
  Cloud Pub/Sub API. The command will generate errors unless you have access to
  this API. This restriction should be relaxed in the near future. Please
  contact cloud-pubsub@google.com with any questions in the meantime.
  """

  @staticmethod
  def Args(parser):
    """Registers flags for this command."""

    parser.add_argument('subscription',
                        help='Name of the subscription to update.')

    parser.add_argument(
        '--ack-deadline', type=int,
        help=('The number of seconds the system will wait for a subscriber to'
              ' acknowledge receiving a message before re-attempting'
              ' delivery.  If set to 0, the system default to be used.'))

    parser.add_argument(
        '--push-endpoint',
        help=('A URL to use as the endpoint for this subscription.'
              ' This will also automatically set the subscription'
              ' type to PUSH.'))

    parser.add_argument(
        '--retain-acked-messages',
        action='store_true',
        default=None,
        help=('Whether or not to retain acknowledged messages.  If true,'
              ' messages are not expunged from the subscription\'s backlog'
              ' until they fall out of the --message-retention-duration'
              ' window.'))

    parser.add_argument(
        '--message-retention-duration',
        type=_Duration(),
        help=('How long to retain unacknowledged messages in the'
              ' subscription\'s backlog, from the moment a message is'
              ' published.  If --retain-acked-messages is true, this also'
              ' configures the retention of acknowledged messages.  Specify'
              ' "default" to use the default value.  Valid values are strings'
              ' of the form INTEGER[UNIT] or "default", where UNIT is one of'
              ' "s", "m", "h", and "d" for seconds, minutes, hours, and days,'
              ' respectively.  If the unit is omitted, seconds is assumed.'))

  @exceptions.CatchHTTPErrorRaiseHTTPException()
  def Run(self, args):
    """This is what gets called when the user runs this command.

    Args:
      args: an argparse namespace. All the arguments that were provided to this
        command invocation.

    Returns:
      A serialized object (dict) describing the results of the operation.
      This description fits the Resource described in the ResourceRegistry under
      'pubsub.projects.subscriptions'.

    Raises:
      An HttpException if there was a problem calling the
      API subscriptions.Patch command.
    """
    client = subscriptions.SubscriptionsClient()
    subscription_ref = util.ParseSubscription(args.subscription)
    result = client.Patch(
        subscription_ref,
        ack_deadline=args.ack_deadline,
        push_config=util.ParsePushConfig(args.push_endpoint),
        retain_acked_messages=args.retain_acked_messages,
        message_retention_duration=args.message_retention_duration)

    result = util.SubscriptionDisplayDict(result)
    log.UpdatedResource(subscription_ref.RelativeName(), kind='subscription')
    return result
