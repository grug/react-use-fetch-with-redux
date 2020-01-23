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

type ContextProps = {
  cacheTimeouts: CacheTimeouts;
  setCacheTimeouts: Dispatch<SetStateAction<CacheTimeouts>>;
  timeTillCacheInvalidate?: number;
};

const ReactUseFetchWithReduxContext = createContext<ContextProps>({
  cacheTimeouts: {},
  setCacheTimeouts: () => {},
});

const ReactUseFetchWithReduxProvider = ({
  children,
  timeTillCacheInvalidate,
}: Props) => {
  const [cacheTimeouts, setCacheTimeouts] = useState<CacheTimeouts>({});

  const contextValue = timeTillCacheInvalidate
    ? { cacheTimeouts, setCacheTimeouts, timeTillCacheInvalidate }
    : { cacheTimeouts, setCacheTimeouts };

  return (
    <ReactUseFetchWithReduxContext.Provider value={contextValue}>
      {children}
    </ReactUseFetchWithReduxContext.Provider>
  );
};

export { ReactUseFetchWithReduxProvider, ReactUseFetchWithReduxContext };
