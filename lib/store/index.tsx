import React, { FC, useEffect, useReducer } from 'react';

export enum ActionKind {
  SETQUERY = 'SETQUERY',
  SETPATH = 'SETPATH',
  SETTHEME = 'SETTHEME',
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

  /**
   * Use document.documentElement.classList
   */
  isDark: boolean;
};

const initialState: State = {
  searchQuery: '',
  backPath: '',
  isDark: false,
};

const reducer = (state: State, action: ReducerAction): State => {
  const { type, payload } = action;
  switch (type) {
    case ActionKind.SETQUERY:
      return { ...state, searchQuery: payload };
    case ActionKind.SETPATH:
      return { ...state, backPath: payload };
    case ActionKind.SETTHEME:
      return {
        ...state,
        isDark: document.documentElement.classList.contains('dark'),
      };
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

  useEffect(() => {
    dispatch({
      type: ActionKind.SETTHEME,
      payload: '',
    });
  }, []);

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
