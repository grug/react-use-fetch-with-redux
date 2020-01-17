import React, { createContext, useContext, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { Action } from 'redux';
import {
  ReactUseFetchWithReduxContext,
  ReactUseFetchWithReduxProvider,
} from './Provider';
import hasCacheTimedOut from './utils/hasCacheTimedOut';

function useFetchWithRedux<State, Selected>(
  getDataStart: () => Action,
  selector: (state: State) => Selected,
  timeTillCacheInvalidateLocal?: number,
) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const [
    cacheTimeouts,
    setCacheTimeouts,
    timeTillCacheInvalidateGlobal,
  ] = useContext(ReactUseFetchWithReduxContext);

  const cacheIndex = getDataStart().type;
  const isCacheSet = Object.keys(cacheTimeouts).includes(cacheIndex);

  const cacheInvalidationTime =
    timeTillCacheInvalidateLocal || timeTillCacheInvalidateGlobal || null;

  useEffect(() => {
    if (!isCacheSet) {
      dispatch(getDataStart());
      if (cacheInvalidationTime) {
        // @ts-ignore
        setCacheTimeouts({
          ...cacheTimeouts,
          [cacheIndex]: {
            cacheInvalidationTime,
            cacheSet: new Date().getTime(),
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
  if (cacheInvalidationTime && hasCacheTimedOut(cacheTimeouts, cacheIndex)) {
    dispatch(getDataStart());
    // @ts-ignore
    setCacheTimeouts({
      ...cacheTimeouts,
      [cacheIndex]: {
        cacheInvalidationTime,
        cacheSet: new Date().getTime(),
      },
    });
  }

  return selected;
}

export { useFetchWithRedux, ReactUseFetchWithReduxProvider };
