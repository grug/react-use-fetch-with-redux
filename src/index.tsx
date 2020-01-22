import { useContext } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { Action } from 'redux';
import {
  ReactUseFetchWithReduxContext,
  ReactUseFetchWithReduxProvider,
} from './Provider';
import { hasCacheTimedOut } from './utils/hasCacheTimedOut';
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
    timeTillCacheInvalidateGlobal,
  } = useContext(ReactUseFetchWithReduxContext);

  const cacheIndex = getDataStart().type;
  const isCacheSet = Object.keys(cacheTimeouts).includes(cacheIndex);

  const timeTillCacheInvalidate =
    options?.timeTillCacheInvalidate ?? timeTillCacheInvalidateGlobal ?? null;

  useEffect(() => {
    if (
      isCacheSet &&
      options?.timeTillCacheInvalidate &&
      !hasCacheTimedOut(cacheTimeouts, cacheIndex)
    ) {
      setCacheTimeouts({
        ...cacheTimeouts,
        [cacheIndex]: {
          timeTillCacheInvalidate,
          cacheSet: Date.now(),
        },
      });
    }

    if (!isCacheSet) {
      if (!selected) {
        dispatch(getDataStart());
      }
      if (timeTillCacheInvalidate) {
        setCacheTimeouts({
          ...cacheTimeouts,
          [cacheIndex]: {
            timeTillCacheInvalidate,
            cacheSet: Date.now(),
          },
        });
      }
    }
  }, [
    cacheIndex,
    cacheTimeouts,
    dispatch,
    getDataStart,
    isCacheSet,
    setCacheTimeouts,
    timeTillCacheInvalidate,
  ]);

  if (
    isCacheSet &&
    timeTillCacheInvalidate &&
    hasCacheTimedOut(cacheTimeouts, cacheIndex)
  ) {
    dispatch(getDataStart());
    setCacheTimeouts({
      ...cacheTimeouts,
      [cacheIndex]: {
        timeTillCacheInvalidate,
        cacheSet: Date.now(),
      },
    });
  }

  return selected;
}

export { useFetchWithRedux, ReactUseFetchWithReduxProvider };
