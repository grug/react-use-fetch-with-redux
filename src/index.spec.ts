import { renderHook } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { Action } from 'redux';
import { useFetchWithRedux } from './';
import { useContext } from 'react';
import { hasCacheTimedOut } from './utils/hasCacheTimedOut';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react', () => ({
  ...require.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('./utils/hasCacheTimedOut', () => ({
  hasCacheTimedOut: jest.fn(),
}));

const mockUseSelector = (useSelector as unknown) as jest.Mock;
const mockUseDispatch = (useDispatch as unknown) as jest.Mock;
const mockUseContext = useContext as jest.Mock;
const mockHasCacheTimedOut = hasCacheTimedOut as jest.Mock;

const mockDispatch = jest.fn();
const setCacheTimeouts = jest.fn();

const testAction = (): Action => ({
  type: 'TEST',
});

const testSelector = <T>(value: T) => value;

describe('useFetchWithRedux hook', () => {
  beforeEach(() => {
    const now = Date.now();
    Date.now = () => now;
    jest.resetAllMocks();
    mockUseDispatch.mockImplementation(() => mockDispatch);
  });

  describe('When no cache has been set', () => {
    describe('With no value provided for timeTillCacheInvalidateGlobal', () => {
      beforeEach(() => {
        mockUseContext.mockImplementation(() => ({
          cacheTimeouts: {},
          setCacheTimeouts,
        }));
      });

      describe('With no value provided for timeTillCacheInvalidate locally', () => {
        it('Returns null when useSelector returns null, and dispatches the action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(null)),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(null);
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith(testAction());
        });

        it('Returns a value when useSelector returns a value, and should not dispatch an action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(7);
          expect(mockDispatch).not.toHaveBeenCalled();
        });
      });

      describe('With a value provided for timeTillCacheInvalidate locally', () => {
        it('Returns null when useSelector returns null, and dispatches the action ', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(null)),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 1234,
            }),
          );

          expect(result.current).toEqual(null);
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith(testAction());
        });

        it('Returns a value when useSelector returns a value, and should not dispatch an action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(7);
          expect(mockDispatch).not.toHaveBeenCalled();
        });

        it('Sets cache with the action type, time and timeTillCacheInvalidate', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 1234,
            }),
          );

          expect(setCacheTimeouts).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 1234,
              cacheSet: Date.now(),
            },
          });
        });
      });
    });

    describe('With a value provided for timeTillCacheInvalidateGlobal', () => {
      beforeEach(() => {
        mockUseContext.mockImplementation(() => ({
          cacheTimeouts: {},
          setCacheTimeouts,
          timeTillCacheInvalidateGlobal: 1111,
        }));
      });

      describe('With no value provided for timeTillCacheInvalidate locally', () => {
        it('Returns null when useSelector returns null, and dispatches the action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(null)),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(null);
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith(testAction());
        });

        it('Returns a value when useSelector returns a value, and should not dispatch an action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(7);
          expect(mockDispatch).not.toHaveBeenCalled();
        });

        it('Sets cache with the action type, time and timeTillCacheInvalidate from context', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          renderHook(() => useFetchWithRedux(testAction, testSelector));

          expect(setCacheTimeouts).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 1111,
              cacheSet: Date.now(),
            },
          });
        });
      });

      describe('With a value provided for timeTillCacheInvalidate locally', () => {
        it('Returns null when useSelector returns null, and dispatches the action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(null)),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 1234,
            }),
          );

          expect(result.current).toEqual(null);
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith(testAction());
        });

        it('Returns a value when useSelector returns a value, and should not dispatch an action', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(7);
          expect(mockDispatch).not.toHaveBeenCalled();
        });

        it('Sets cache with the action type, time and timeTillCacheInvalidate from the hook input', () => {
          mockUseSelector.mockImplementation(callback =>
            callback(testSelector(testSelector<number>(7))),
          );

          renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 1234,
            }),
          );

          expect(setCacheTimeouts).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 1234,
              cacheSet: Date.now(),
            },
          });
        });
      });
    });
  });

  describe('When timeTillCacheInvalidate has been set by the provider', () => {
    beforeEach(() => {
      mockUseContext.mockImplementation(() => ({
        cacheTimeouts: {
          TEST: {
            timeTillCacheInvalidate: 1234,
            cacheSet: Date.now(),
          },
        },
        setCacheTimeouts,
        timeTillCacheInvalidateGlobal: 2222,
      }));

      mockUseSelector.mockImplementation(callback =>
        callback(testSelector(4444)),
      );
    });

    describe('Before it has expired', () => {
      beforeEach(() => {
        mockHasCacheTimedOut.mockImplementation(() => false);
      });

      describe('With no timeTillCacheInvalidate included in the hooks options', () => {
        it('Returns the value from useSelector', () => {
          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(4444);
        });

        it('Does not dispatch an action', () => {
          renderHook(() => useFetchWithRedux(testAction, testSelector));
          expect(mockDispatch).not.toHaveBeenCalled();
        });

        it('Should not make a call to setCacheTimeouts to update the cache', () => {
          renderHook(() => useFetchWithRedux(testAction, testSelector));
          expect(setCacheTimeouts).not.toHaveBeenCalled();
        });
      });

      describe('When timeTillCacheInvalidate is also included in the hooks options', () => {
        it('Should make a call to setCacheTimeouts to update the cache to the value provided by the options value', () => {
          renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 6464,
            }),
          );

          expect(setCacheTimeouts).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 6464,
              cacheSet: Date.now(),
            },
          });
        });

        it('Should not dispatch an action', () => {
          renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 6464,
            }),
          );

          expect(mockDispatch).not.toHaveBeenCalled();
        });
      });
    });

    describe('After it has expired', () => {
      beforeEach(() => {
        mockHasCacheTimedOut.mockImplementation(() => true);
      });

      describe('With no timeTillCacheInvalidate included in the hooks options', () => {
        it('Returns the value from useSelector', () => {
          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(4444);
        });

        it('Dispatches an action', () => {
          renderHook(() => useFetchWithRedux(testAction, testSelector));
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith(testAction());
        });

        it('Should make a call to setCacheTimeouts to update the cache', () => {
          renderHook(() => useFetchWithRedux(testAction, testSelector));
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 2222,
              cacheSet: Date.now(),
            },
          });
        });
      });

      describe('When timeTillCacheInvalidate is also included in the hooks options', () => {
        it('Returns the value from useSelector', () => {
          const { result } = renderHook(() =>
            useFetchWithRedux(testAction, testSelector),
          );

          expect(result.current).toEqual(4444);
        });

        it('Should make a call to setCacheTimeouts to update the cache to the value provided by the options value', () => {
          renderHook(() =>
            useFetchWithRedux(testAction, testSelector, {
              timeTillCacheInvalidate: 6464,
            }),
          );

          expect(setCacheTimeouts).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 6464,
              cacheSet: Date.now(),
            },
          });
        });

        it('Should dispatch the action', () => {
          renderHook(() => useFetchWithRedux(testAction, testSelector));
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith(testAction());
        });

        it('Should make a call to setCacheTimeouts to update the cache', () => {
          renderHook(() => useFetchWithRedux(testAction, testSelector));
          expect(setCacheTimeouts).toHaveBeenCalledTimes(1);
          expect(setCacheTimeouts).toHaveBeenCalledWith({
            TEST: {
              timeTillCacheInvalidate: 2222,
              cacheSet: Date.now(),
            },
          });
        });
      });
    });
  });
});
