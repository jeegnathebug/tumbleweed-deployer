import { WebClient } from '@slack/web-api';

let client;
const TOKEN = process.env.SLACK_TOKEN;
const TUMBLEWEED_CHANNEL_ID = process.env.TUMBLEWEED_CHANNEL_ID;
const NUM_DAYS_OF_HISTORY_TO_GET_IN_MS = (+process.env.NUM_DAYS_TO_CHECK) * 24 * 60 * 60 * 1000;

const ignoredUserIdsEnv = process.env.IGNORE_USER_IDS.split(',');
const ignoredUserIds = [...ignoredUserIdsEnv, process.env.BOT_USER_ID];

const initialiseClient = (token) => {
    if (!client) {
        client = new WebClient(token);
    }
}

const publishMessage = async (channelId, text) => {
    await client.chat.postMessage({
        channel: channelId,
        text: text,
    });
}

const getChannelHistory = async (channelId, afterTimestamp) => {
    const result = await client.conversations.history({
        channel: channelId,
        oldest: afterTimestamp,
    });

    return result.messages;
}

export const handler = async () => {
    console.info('Received trigger event');

    if (!TOKEN) {
        console.log('No slack token defined!');
        return;
    }

    initialiseClient(TOKEN);

    const numDaysOfHistoryToGet = new Date(Date.now() - NUM_DAYS_OF_HISTORY_TO_GET_IN_MS).getTime() / 1000;
    const history = await getChannelHistory(TUMBLEWEED_CHANNEL_ID, numDaysOfHistoryToGet);

    let sendMessage = true;
    history.forEach(message => {
        const shouldIgnore = ignoredUserIds.includes(message.user);
        console.info(`Message in history sent by "${message.user}". Ignoring?: ${shouldIgnore}`);
        sendMessage &= shouldIgnore;
    });

    if (sendMessage) {
        console.info('Deploying tumbleweed');
        await publishMessage(TUMBLEWEED_CHANNEL_ID, ':tumbleweed: :tumbleweed: :tumbleweed:');
    }
};
