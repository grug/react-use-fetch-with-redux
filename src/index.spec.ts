import { renderHook } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { Action } from 'redux';
import { useFetchWithRedux } from './';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockUseSelector = (useSelector as unknown) as jest.Mock;
const mockUseDispatch = (useDispatch as unknown) as jest.Mock;
const mockDispatch = jest.fn();

const testAction = (): Action => ({
  type: 'TEST',
});
const testSelector = <T>(value: T) => value;

describe('useFetchWithRedux hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseDispatch.mockImplementation(() => mockDispatch);
  });

  it('Calls dispatch when value does not exist in state', () => {
    mockUseSelector.mockImplementation(callback =>
      callback(testSelector(undefined)),
    );

    const { result } = renderHook(() =>
      useFetchWithRedux(testAction, testSelector, false),
    );

    expect(result.current).toEqual(undefined);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Returns value from state when it exists and does not dispatch action', () => {
    mockUseSelector.mockImplementation(callback =>
      callback(testSelector<number>(7)),
    );

    const { result } = renderHook(() =>
      useFetchWithRedux(testAction, testSelector, false),
    );

    expect(result.current).toEqual(7);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('Does not call dispatch if emptyArrayIsFalse = false and selected data is an empty array', () => {
    mockUseSelector.mockImplementation(callback => callback(testSelector([])));

    const { result } = renderHook(() =>
      useFetchWithRedux(testAction, testSelector, false),
    );

    expect(result.current).toEqual([]);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('Does call dispatch if emptyArrayIsFalse = true and selected data is an empty array', () => {
    mockUseSelector.mockImplementation(callback => callback(testSelector([])));

    const { result } = renderHook(() =>
      useFetchWithRedux(testAction, testSelector, true),
    );

    expect(result.current).toEqual([]);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
