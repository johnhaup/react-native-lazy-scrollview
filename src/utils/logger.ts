export const log = (TAG: string, ...args: Parameters<typeof console.log>) => {
  if (__DEV__) {
    console.log('[LazyScrollView]', TAG, ...args);
  }
};

export const logger = {
  log,
};
