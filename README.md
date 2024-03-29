# tumbleweed-deployer

AWS Lambda handler to send a tumbleweed message to a given Slack channel, if after a certain amount of time, no one has sent a message in the channel. The slack bot itself that is used to send the tumbleweed emojis will not count towards the channel having a message sent to it. A comma-separated list of other slack user ids can also be given to be ignored.

## Prerequisites

1. A Slack bot that will be used to send the tumbleweed messages.

2. A custom emoji set in the Slack workspace called `tumbleweed`.

3. A scheduled event (cron) trigger applied to the lambda.

4. Requires the following environment variables to be set in the lambda's enviroment:
```
SLACK_TOKEN: <Slack token>
TUMBLEWEED_CHANNEL_ID: <Slack channel id in which to send tumbleweed emojis. This is the same channel to check for sent messages>
NUM_DAYS_TO_CHECK: <number of days of channel message history to check before sending tumbleweed emojis>
IGNORE_USER_IDS: <comma-separated string of Slack user ids of users whose messages should be ignored when checking if channel history is empty>
BOT_USER_ID: <Slack user id of the Slack bot that will be used to send the tumbleweed message>
```
