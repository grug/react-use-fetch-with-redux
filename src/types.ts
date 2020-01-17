export type CacheTimeouts = {
  [key: string]: {
    timeTillCacheInvalidate: number;
    cacheSet: number;
  };
};
