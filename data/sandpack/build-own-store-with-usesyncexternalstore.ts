export const multi = `import { useSyncExternalStore } from 'react';

export type SetState<S> = (stateOrFn: S | ((state: S) => S)) => void;
export type GetSnapshot<S> = () => S;
export type Subscribe = (listener: () => void) => () => void;
export type CreateStore = <T extends Record<string, unknown> | unknown[]>(
  initialState: T
) => {
  getSnapshot: GetSnapshot<T>;
  setState: SetState<T>;
  subscribe: Subscribe;
};

export const createStore: CreateStore = <
  T extends Record<string, unknown> | unknown[]
>(
  initialState: T
) => {
  let state = initialState;

  const listeners = new Set<() => void>();
  const getSnapshot = () => state;
  const setState: SetState<T> = (stateOrFn) => {
    state = typeof stateOrFn === 'function' ? stateOrFn(state) : stateOrFn;
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getSnapshot,
    setState,
    subscribe,
  };
};

export type Todo = {
  id: number;
  content: string;
}[];
const initialTodo: Todo = [
  { id: 0, content: 'React' },
  { id: 1, content: 'Vue' },
];
const todoStore = createStore(initialTodo);
export const useTodoStore = (): [Todo, SetState<Todo>] => [
  useSyncExternalStore(todoStore.subscribe, todoStore.getSnapshot),
  todoStore.setState,
];

type Count = {
  count: number;
  info: string;
};
const initialCount: Count = {
  count: 0,
  info: 'Hello',
};
const countStore = createStore(initialCount);
export const useCountStore = (): [Count, SetState<Count>] => [
  useSyncExternalStore(countStore.subscribe, countStore.getSnapshot),
  countStore.setState,
];`;

export const miniRedux = `import { useSyncExternalStore } from 'react';

export type RUAState = Record<string, unknown> | unknown[];
export type RUAAction<P = unknown, T extends string = string> = {
  payload: P;
  type: T;
};
export type RUAReducer<S extends RUAState, A extends RUAAction> = (
  state: S,
  action: A
) => S;
export type RUADispatch<A extends RUAAction> = (action: A) => void;
export type GetSnapshot<S> = () => S;
export type Subscribe = (listener: () => void) => () => void;

export const createStore = <S extends RUAState, A extends RUAAction>(
  reducer: RUAReducer<S, A>,
  initialState: S
) => {
  let state = initialState;

  const listeners = new Set<() => void>();
  const getSnapshot = () => state;
  const dispatch: RUADispatch<A> = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    subscribe,
    getSnapshot,
    dispatch,
  };
};

export type Todo = {
  id: number;
  content: string;
}[];
const initialTodo: Todo = [
  { id: 0, content: 'React' },
  { id: 1, content: 'Vue' },
];
export type TodoAction = RUAAction<number | string, 'add' | 'delete'>;

const reducer: RUAReducer<Todo, TodoAction> = (state, action) => {
  switch (action.type) {
    case 'add': {
      if (action.payload == null) throw new Error('Add todo without payload!');
      return [
        ...state,
        {
          id: state[state.length - 1].id + 1,
          content: action.payload.toString(),
        },
      ];
    }
    case 'delete': {
      if (action.payload == null)
        throw new Error('Delete todo without payload!');
      return state.filter((todo) => todo.id !== action.payload);
    }
    default:
      throw new Error('Dispatch a reducer without action!');
  }
};

const todoStore = createStore(reducer, initialTodo);
export const useTodoStore = (): [Todo, RUADispatch<TodoAction>] => [
  useSyncExternalStore(todoStore.subscribe, todoStore.getSnapshot),
  todoStore.dispatch,
];`;

export const MultiStore = `import Button from './Button';
import Input from './Input';
import { useState } from 'react';
import { useCountStore, useTodoStore } from './multi';

const Todo = () => {
  const [todos, setTodo] = useTodoStore();
  const [value, setValue] = useState('');
  const handleAdd = () => {
    if (!value) return;
    setTodo((d) => [...d, { id: d[d.length - 1].id + 1, content: value }]);
    setValue('');
  };

  return (
    <>
      <div>
        <ul>
          {todos.map((todo) => (
            <div key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              className="flex items-center mb-2"
            >
              <li className="mr-2">{todo.content}</li>
              <Button
                onClick={() =>
                  setTodo((d) => d.filter((item) => item.id !== todo.id))
                }
              >
                Delete
              </Button>
            </div>
          ))}
        </ul>

        <div>
          <Input
            type="text"
            className="mr-1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </>
  );
};

const Count = () => {
  const [{ count, info }, setState] = useCountStore();

  return (
    <>
      <div>
        <div>
          Count: <span>{count}</span>
        </div>
        <div>
          Info: <span>{info}</span>
        </div>

        <div>
          <Button
            onClick={() => setState((d) => ({ ...d, count: d.count + 1 }))}
          >
            Add
          </Button>
        </div>
        <div>
          <Input
            type="text"
            onChange={(e) => setState((d) => ({ ...d, info: e.target.value }))}
            value={info}
          />
        </div>
      </div>
    </>
  );
};

const MultiStore = () => {
  return (
    <>
      <div className="p-4">
        <Todo />
        <hr className="my-4" />
        <Count />
      </div>
    </>
  );
};

export default MultiStore;`;

export const Reducer = `import Button from './Button';
import Input from './Input';
import { useState } from 'react';
import { useTodoStore } from './store.ts';

const Reducer = () => {
  const [todos, dispatch] = useTodoStore();
  const [value, setValue] = useState('');
  const handleAdd = () => {
    if (!value) return;
    dispatch({
      type: 'add',
      payload: value,
    });
    setValue('');
  };

  return (
    <>
      <div className="p-4">
        <div>
          <ul>
            {todos.map((todo) => (
              <div key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                className="flex items-center mb-2"
              >
                <li className="mr-2">{todo.content}</li>
                <Button
                  onClick={() => dispatch({ type: 'delete', payload: todo.id })}
                >
                  Delete
                </Button>
              </div>
            ))}
          </ul>

          <div>
            <Input
              type="text"
              className="mr-1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reducer;`;
