import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Action } from 'redux';

function useFetchWithRedux<State, Selected>(
  getDataStart: () => Action,
  selector: (state: State) => Selected,
) {
  const dispatch = useDispatch();
  const selected = useSelector(selector);

  useEffect(() => {
    if (selected === null) {
      dispatch(getDataStart());
    }
  }, [dispatch]);

  return selected;
}

export { useFetchWithRedux };
