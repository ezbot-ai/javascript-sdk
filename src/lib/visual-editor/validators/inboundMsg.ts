/* eslint-disable functional/no-throw-statements */
const inboundMsg = (msg: Readonly<MessageEvent>): boolean => {
  try {
    const data = JSON.parse(msg.data);
    if (!data.type) {
      throw new Error('Event type not found on incoming event');
    }
    return true;
  } catch (error) {
    // throw away messages that are not valid JSON
    return false;
  }
};

export { inboundMsg };
