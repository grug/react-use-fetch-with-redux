import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Action } from 'redux';

function useFetchWithRedux<State, Selected>(
  getDataStart: () => Action,
  selector: (state: State) => Selected,
  emptyArrayIsFalse: boolean = false,
) {
  const dispatch = useDispatch();
  const selected = useSelector(selector);

  useEffect(() => {
    if (
      !selected ||
      (emptyArrayIsFalse && Array.isArray(selected) && selected.length === 0)
    ) {
      dispatch(getDataStart());
    }
  }, [dispatch]);

  return selected;
}

export { useFetchWithRedux };
