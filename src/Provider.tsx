import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { CacheTimeouts } from './types';

type Props = {
  children: JSX.Element;
  timeTillCacheInvalidate?: number;
};

type IContextProps = {
  cacheTimeouts: {};
  setCacheTimeouts: Dispatch<SetStateAction<CacheTimeouts>>;
  timeTillCacheInvalidateGlobal?: number;
};

const ReactUseFetchWithReduxContext = createContext({
  cacheTimeouts: {},
  setCacheTimeouts: () => {},
} as IContextProps);

const ReactUseFetchWithReduxProvider = ({
  children,
  timeTillCacheInvalidate,
}: Props) => {
  const [cacheTimeouts, setCacheTimeouts] = useState<CacheTimeouts>({});

  const value = timeTillCacheInvalidate
    ? { cacheTimeouts, setCacheTimeouts, timeTillCacheInvalidate }
    : { cacheTimeouts, setCacheTimeouts };

  return (
    <ReactUseFetchWithReduxContext.Provider value={value}>
      {children}
    </ReactUseFetchWithReduxContext.Provider>
  );
};

export { ReactUseFetchWithReduxProvider, ReactUseFetchWithReduxContext };
