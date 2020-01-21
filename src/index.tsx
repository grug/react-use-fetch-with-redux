import { useContext } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { Action } from 'redux';
import {
  ReactUseFetchWithReduxContext,
  ReactUseFetchWithReduxProvider,
} from './Provider';
import { hasCacheTimedOut } from './utils/hasCacheTimedOut';

type Options = {
  timeTillCacheInvalidate: number;
};

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

  const cacheInvalidationTime =
    options?.timeTillCacheInvalidate ?? timeTillCacheInvalidateGlobal ?? null;

  useEffect(() => {
    if (!isCacheSet) {
      if (!selected) dispatch(getDataStart());
      if (cacheInvalidationTime) {
        setCacheTimeouts({
          ...cacheTimeouts,
          [cacheIndex]: {
            cacheInvalidationTime,
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
    cacheInvalidationTime,
  ]);

  if (
    isCacheSet &&
    cacheInvalidationTime &&
    hasCacheTimedOut(cacheTimeouts, cacheIndex)
  ) {
    dispatch(getDataStart());
    setCacheTimeouts({
      ...cacheTimeouts,
      [cacheIndex]: {
        cacheInvalidationTime,
        cacheSet: Date.now(),
      },
    });
  }

  return selected;
}

export { useFetchWithRedux, ReactUseFetchWithReduxProvider };
