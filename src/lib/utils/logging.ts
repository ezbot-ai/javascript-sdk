/* eslint-disable functional/no-return-void */
const logError = (error: Readonly<Error>) => {
  console.error(error);
};

const logInfo = (info: Readonly<string>, payload?: unknown) => {
  if (payload) {
    console.info(`[ezbot sdk] ${info}`, payload);
    return;
  }

  console.info(`[ezbot sdk] ${info}`);
};
export { logError, logInfo };
