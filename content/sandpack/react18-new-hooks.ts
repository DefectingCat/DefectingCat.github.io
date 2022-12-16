export const useTransition = `import Button from './Button';
import { useState, useTransition } from 'react';

const UseTransition = () => {
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(-1);
  const [length, setLength] = useState(30000);
  const [pending, setTransiton] = useTransition();

  const handleClick = () => {
    setValue((v) => v + 1);
    setTransiton(() => setLength((l) => l + 1));
    // setLength((l) => l + 1);
  };

  return (
    <>
      <div className="my-4">
        <Button onClick={handleClick}>{value}</Button>
        <Button onClick={() => setValue2((v) => v - 1)}>{value2}</Button>
      </div>

      <div
        className={\`wrapper \${pending && \`fade\`}\`}
      >
        {Array.from({ length }).map((_, i) => (
          <div className="p-2 mb-2 mr-2 rounded-md shadow" key={length - i}>
            {length - i}
          </div>
        ))}
      </div>

      <style>{\`
        .wrapper {
          transition: all 0.3 ease;
        }
      
        .fade {
          opacity: 0.5;
        }\`}
      </style>
    </>
  );
};

export default UseTransition;`;

export const useDeferredValue = `import Button from './Button';
import { useDeferredValue, useState } from 'react';

const UseDeferredValue = () => {
  const [value, setValue] = useState(0);
  const deferred = useDeferredValue(value);

  return (
    <>
      <div className="my-4">
        <div>
          Deferred:
          <Button onClick={() => setValue((v) => v + 1)}>{deferred}</Button>
        </div>

        <div>
          Primtive:
          <Button onClick={() => setValue((v) => v + 1)}>{value}</Button>
        </div>
      </div>

      <div>
        {Array.from({ length: 30000 }).map((_, i) => (
          <div className="p-2 mb-2 mr-2 rounded-md shadow" key={i}>
            {i}
          </div>
        ))}
      </div>
    </>
  );
};

export default UseDeferredValue;`;

export const useId = `import Input from './Input';
import { useId } from 'react';

const RUAForm = () => {
  const id = useId();

  return (
    <>
      <label htmlFor={\`\${id}\`}>Label 1: </label>
      <div>
        <Input type="text" id={\`\${id}\`} />
      </div>
    </>
  );
};

const UseId = () => {
  return (
    <>
      <RUAForm />
      <RUAForm />
    </>
  );
};

export default UseId;`;

export const store = `export type State = {
  count: number;
  info: string;
};
export type Store = {
  state: State;
  setState: (
    stateOrFn: State | ((state: State) => State)
  ) => void;
  subscribe: (listener: () => void) => () => void;
  listeners: Set<() => void>;
  getSnapshot: () => State;
};

const store: Store = {
  state: {
    count: 0,
    info: 'Hello',
  },
  setState(stateOrFn) {
    const newState =
      typeof stateOrFn === 'function' ? stateOrFn(store.state) : stateOrFn;
    store.state = {
      ...store.state,
      ...newState,
    };
    store.listeners.forEach((listener) => listener());
  },
  listeners: new Set(),
  subscribe(listener) {
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  },
  getSnapshot() {
    return store.state;
  },
};

export default store;`;
export const useSyncExternalStore = `import Button from './Button';
import Input from './Input';
import { useSyncExternalStore } from 'react';
import store from './store';

const Couter = () => {
  const { count, info } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  );

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
            onClick={() => store.setState((d) => ({ ...d, count: d.count + 1 }))}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

const Infor = () => {
  const { count, info } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  );

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
          <Input
            type="text"
            onChange={(e) => store.setState((d) => ({ ...d, info: e.target.value }))}
            value={info}
          />
        </div>
      </div>
    </>
  );
};

const UseSyncExternalStore = () => {
  return (
    <>
      <Couter />
      <hr className="my-4" />
      <Infor />
    </>
  );
};

export default UseSyncExternalStore;`;

export const useInsertionEffect = `import { useEffect, useLayoutEffect, useInsertionEffect } from 'react';

const Child = () => {
  useEffect(() => {
    console.log('useEffect child is called');
  });
  useLayoutEffect(() => {
    console.log('useLayoutEffect child is called');
  });
  useInsertionEffect(() => {
    console.log('useInsertionEffect child is called');
  });

  return <></>;
};

const UseInsertionEffect = () => {
  useEffect(() => {
    console.log('useEffect app is called');
  });
  useLayoutEffect(() => {
    console.log('useLayoutEffect app is called');
  });
  useInsertionEffect(() => {
    console.log('useInsertionEffect app is called');
  });

  return (
    <>
      <Child />
      <div>Check console in DevTools</div>
    </>
  );
};

export default UseInsertionEffect;`;
