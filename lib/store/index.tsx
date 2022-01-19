import React, { FC, useReducer } from 'react';

export enum ActionKind {
  SETQUERY = 'SETQUERY',
  SETPATH = 'SETPATH',
}

type ReducerAction = {
  type: ActionKind;
  payload: string;
};

type State = {
  /**
   * Url query string used by search box.
   * Shared with search box.
   */
  searchQuery: string;

  /**
   * Back path to record where to go back.
   */
  backPath: string;
};

const initialState: State = {
  searchQuery: '',
  backPath: '',
};

const reducer = (state: State, action: ReducerAction): State => {
  const { type, payload } = action;
  switch (type) {
    case ActionKind.SETQUERY:
      return { ...state, searchQuery: payload };
    case ActionKind.SETPATH:
      return { ...state, backPath: payload };
    default:
      throw new Error();
  }
};

const RUAContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<ReducerAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const RUAStore: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <RUAContext.Provider value={{ state, dispatch }}>
        {children}
      </RUAContext.Provider>
    </>
  );
};

export function useRUAContext() {
  return React.useContext(RUAContext);
}

export default RUAStore;
