export type Options = {
  timeTillCacheInvalidate: number;
};

export type CacheTimeouts = {
  [key: string]: {
    timeTillCacheInvalidate: number;
    cacheSet: number;
  };
};
