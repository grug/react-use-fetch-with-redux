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

  if (timeRemaining < 0) {
    return 0;
  } else {
    return timeRemaining;
  }
};

export default getRemainingCacheTime;
