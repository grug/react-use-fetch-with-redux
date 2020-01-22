import { CacheTimeouts } from '../types';

const hasCacheTimedOut = (cacheTimeouts: CacheTimeouts, cacheIndex: string) => {
  const { cacheSet, timeTillCacheInvalidate } = cacheTimeouts[cacheIndex];
  return Date.now() - cacheSet > timeTillCacheInvalidate;
};

export { hasCacheTimedOut };
