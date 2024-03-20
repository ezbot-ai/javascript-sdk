const inboundMsg = (msg: Readonly<MessageEvent>): boolean => {
  try {
    JSON.parse(msg.data);
    return true;
  } catch (error) {
    // drop messages that can't be parsed
    return false;
  }
};

export { inboundMsg };
