import { useContext } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { Action } from 'redux';
import {
  ReactUseFetchWithReduxContext,
  ReactUseFetchWithReduxProvider,
} from './Provider';
import { getRemainingCacheTime } from './utils';
import { Options } from './types';

function useFetchWithRedux<State, Selected>(
  getDataStart: () => Action,
  selector: (state: State) => Selected,
  options?: Options,
) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const {
    cacheTimeouts,
    setCacheTimeouts,
    timeTillCacheInvalidate: timeTillCacheInvalidateGlobal,
  } = useContext(ReactUseFetchWithReduxContext);

  useEffect(() => {
    const cacheIndex = getDataStart().type;
    const isCacheSet = Object.keys(cacheTimeouts).includes(cacheIndex);
    const remainingCacheTime = getRemainingCacheTime(cacheTimeouts, cacheIndex);
    const timeTillCacheInvalidate =
      options?.timeTillCacheInvalidate ?? timeTillCacheInvalidateGlobal ?? null;

    if (!isCacheSet && !selected) {
      dispatch(getDataStart());
    }

    const cacheShouldBeOverwritten =
      isCacheSet &&
      options?.timeTillCacheInvalidate &&
      options?.timeTillCacheInvalidate < remainingCacheTime;

    if ((timeTillCacheInvalidate && !isCacheSet) || cacheShouldBeOverwritten) {
      setCacheTimeouts({
        ...cacheTimeouts,
        [cacheIndex]: {
          timeTillCacheInvalidate,
          cacheSet: Date.now(),
        },
      });
    }

    if (isCacheSet && remainingCacheTime === 0) {
      dispatch(getDataStart());
      setCacheTimeouts({
        ...cacheTimeouts,
        [cacheIndex]: {
          timeTillCacheInvalidate,
          cacheSet: Date.now(),
        },
      });
    }
  }, [
    cacheTimeouts,
    dispatch,
    getDataStart,
    options,
    selected,
    setCacheTimeouts,
  ]);

  return selected;
}

export { useFetchWithRedux, ReactUseFetchWithReduxProvider };
