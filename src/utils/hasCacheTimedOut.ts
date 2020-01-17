import { CacheTimeouts } from '../types';

const hasCacheTimedOut = (cacheTimeouts: CacheTimeouts, cacheIndex: string) => {
  const { cacheSet, timeTillCacheInvalidate } = cacheTimeouts[cacheIndex];
  if (Date.now() - cacheSet > timeTillCacheInvalidate) return true;
  else return false;
};

export default hasCacheTimedOut;
