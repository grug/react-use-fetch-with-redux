import { CacheTimeouts } from '../types';

const getRemainingCacheTime = (
  cacheTimeouts: CacheTimeouts,
  cacheIndex: string,
) => {
  if (!cacheTimeouts[cacheIndex]) {
    return 0;
  }

  const { cacheSet, timeTillCacheInvalidate } = cacheTimeouts[cacheIndex];

  const timeRemaining = timeTillCacheInvalidate + cacheSet - Date.now();

  return timeRemaining < 0 ? 0 : timeRemaining;
};

export default getRemainingCacheTime;
