import { renderHook } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { Action } from 'redux';
import { useFetchWithRedux } from './';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockUseSelector = useSelector as jest.Mock;
const mockUseDispatch = useDispatch as jest.Mock;
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

  it('Returns null and calls dispatch when selector returns null', () => {
    mockUseSelector.mockImplementation(callback =>
      callback(testSelector(null)),
    );

    const { result } = renderHook(() =>
      useFetchWithRedux(testAction, testSelector),
    );

    expect(result.current).toEqual(null);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Returns value from state and does not call dispatch when selector returns data', () => {
    mockUseSelector.mockImplementation(callback =>
      callback(testSelector<number>(7)),
    );

    const { result } = renderHook(() =>
      useFetchWithRedux(testAction, testSelector),
    );

    expect(result.current).toEqual(7);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
