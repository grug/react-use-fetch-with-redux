import React, { useState, createContext } from 'react';

type Props = {
  children: JSX.Element;
  timeTillCacheInvalidate?: number;
};

const ReactUseFetchWithReduxContext = createContext([{}, () => {}]);

const ReactUseFetchWithReduxProvider = ({
  children,
  timeTillCacheInvalidate,
}: Props) => {
  const [cacheTimeouts, setCacheTimeouts] = useState({});

  const value = timeTillCacheInvalidate
    ? [cacheTimeouts, setCacheTimeouts, timeTillCacheInvalidate]
    : [cacheTimeouts, setCacheTimeouts];

  return (
    <ReactUseFetchWithReduxContext.Provider value={value}>
      {children}
    </ReactUseFetchWithReduxContext.Provider>
  );
};

export { ReactUseFetchWithReduxProvider, ReactUseFetchWithReduxContext };
