import getRemainingCacheTime from './getRemainingCacheTime';
import { CacheTimeouts } from '../types';

describe('getRemainingCacheTime', () => {
  beforeEach(() => {
    Date.now = () => 20;
  });

  const cacheTimeouts: CacheTimeouts = {
    TEST_ACTION_1: {
      cacheSet: 5,
      timeTillCacheInvalidate: 10,
    },
    TEST_ACTION_2: {
      cacheSet: 10,
      timeTillCacheInvalidate: 10,
    },
    TEST_ACTION_3: {
      cacheSet: 15,
      timeTillCacheInvalidate: 10,
    },
  };

  it('Returns  0 if the remaining time is negative', () => {
    const result = getRemainingCacheTime(cacheTimeouts, 'TEST_ACTION_1');
    expect(result).toEqual(0);
  });

  it('Returns 0 if the remaining time is 0', () => {
    const result = getRemainingCacheTime(cacheTimeouts, 'TEST_ACTION_2');
    expect(result).toEqual(0);
  });

  it('Returns correct value if larger than 0', () => {
    const result = getRemainingCacheTime(cacheTimeouts, 'TEST_ACTION_3');
    expect(result).toEqual(5);
  });

  it('Returns 0 if the cache is not set', () => {
    const result = getRemainingCacheTime(cacheTimeouts, 'TEST_ACTION_4');
    expect(result).toEqual(0);
  });
});
