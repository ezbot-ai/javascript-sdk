const inboundMsg = (msg: Readonly<MessageEvent>): boolean => {
  try {
    const data = JSON.parse(msg.data);
    // TODO: consider better validation
    if (!data.type) {
      return false;
    }
    return true;
  } catch (error) {
    // throw away messages that are not valid JSON
    return false;
  }
};

export { inboundMsg };
