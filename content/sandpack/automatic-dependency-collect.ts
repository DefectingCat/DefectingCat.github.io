export const signal1 = `import { useRef, useState as useUpdate } from "react";

export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((oldValue: T) => T)) => void;
export type UseState = <T>(value: T) => [Getter<T>, Setter<T>];

export const useState: UseState = (value) => {
  const state = useRef(value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = useUpdate({});

  const getter: Getter<typeof value> = () => {
    return state.current;
  };

  const setter: Setter<typeof value> = (updater) => {
    const newState =
      updater instanceof Function ? updater(state.current) : updater;
    if (state.current === newState) return;
    state.current = newState;
    update({});
  };

  return [getter, setter];
};
`;

export const app1 = `import { useState } from "./signal";
import Button from './Button';

function App() {
  console.log('App updated');
  const [count, setCount] = useState(0);

  return (
    <>
      <Button
        onClick={() => {
          setCount((d) => d + 1);
        }}
      >
        Update {count()}
      </Button>
    </>
  );
}

export default App;
`;

export const signal2 = `/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState as useUpdate, useEffect as useMounted } from 'react';

export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((oldValue: T) => T)) => void;
export type UseState = <T>(value: T) => [Getter<T>, Setter<T>];
export type Subs = Set<Effect>;

export type Effect = {
  // 用于执行 useEffect 回调函数
  execute: () => void;
  // 保存该 useEffect 依赖的 state 对应的 subs 集合
  deps: Set<Subs>;
};
const effectStack: Effect[] = [];

const subscribe = (effect: Effect, subs: Subs) => {
  // 建立订阅关系
  subs.add(effect);
  // 建立依赖关系
  effect.deps.add(subs);
};
const useState: UseState = (value) => {
  const state = useRef(value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = useUpdate({});

  const subs = useRef(new Set<Effect>());

  const getter: Getter<typeof value> = () => {
    // 获取刚刚送入栈中的 effect
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      // 建立订阅发布关系
      subscribe(effect, subs.current);
    }
    return state.current;
  };

  const setter: Setter<typeof value> = (updater) => {
    const newState =
      updater instanceof Function ? updater(state.current) : updater;
    if (state.current === newState) return;

    state.current = newState;
    update({});
    // 通知所有订阅 effect 状态变化
    for (const sub of [...subs.current]) {
      sub.execute();
    }
  };

  return [getter, setter];
};

const cleanup = (effect: Effect) => {
  for (const subs of effect.deps) {
    subs.delete(effect);
  }
  effect.deps.clear();
};

const useEffect = (callback: () => void) => {
  const execute = () => {
    // 重制依赖
    cleanup(effect);
    // 添加到副作用列表
    effectStack.push(effect);
    try {
      callback();
    } finally {
      effectStack.pop();
    }
  };
  const effect: Effect = {
    execute,
    deps: new Set(),
  };

  useMounted(() => {
    // 调用时执行
    execute();
  }, []);
};

export { useState, useEffect };
`;

export const app2 = `import { useState, useEffect } from "./signal";
import Button from './Button';

function App() {
  console.log('App updated');
  const [count, setCount] = useState(0);

  console.log('App updated');
  useEffect(() => {
    console.log('count is ', count());
  });
  useEffect(() => {
    console.log('effect update');
  });

  return (
    <>
      <Button
        onClick={() => {
          setCount((d) => d + 1);
        }}
      >
        Update {count()}
      </Button>
    </>
  );
}

export default App;
`;

export const signal3 = `/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState as useUpdate, useEffect as useMounted } from 'react';

export type Getter<T> = () => T;
export type Setter<T> = (newValue: T | ((oldValue: T) => T)) => void;
export type UseState = <T>(value: T) => [Getter<T>, Setter<T>];
export type Subs = Set<Effect>;

export type Effect = {
  // 用于执行 useEffect 回调函数
  execute: () => void;
  // 保存该 useEffect 依赖的 state 对应的 subs 集合
  deps: Set<Subs>;
};
const effectStack: Effect[] = [];

const subscribe = (effect: Effect, subs: Subs) => {
  // 建立订阅关系
  subs.add(effect);
  // 建立依赖关系
  effect.deps.add(subs);
};
const useState: UseState = (value) => {
  const state = useRef(value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = useUpdate({});

  const subs = useRef(new Set<Effect>());

  const getter: Getter<typeof value> = () => {
    // 获取刚刚送入栈中的 effect
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      // 建立订阅发布关系
      subscribe(effect, subs.current);
    }
    return state.current;
  };

  const setter: Setter<typeof value> = (updater) => {
    const newState =
      updater instanceof Function ? updater(state.current) : updater;
    if (state.current === newState) return;

    state.current = newState;
    update({});
    // 通知所有订阅 effect 状态变化
    for (const sub of [...subs.current]) {
      sub.execute();
    }
  };

  return [getter, setter];
};

const cleanup = (effect: Effect) => {
  for (const subs of effect.deps) {
    subs.delete(effect);
  }
  effect.deps.clear();
};

const useEffect = (callback: () => void) => {
  const execute = () => {
    // 重制依赖
    cleanup(effect);
    // 添加到副作用列表
    effectStack.push(effect);
    try {
      callback();
    } finally {
      effectStack.pop();
    }
  };
  const effect: Effect = {
    execute,
    deps: new Set(),
  };

  useMounted(() => {
    // 调用时执行
    execute();
  }, []);
};

const useMemo = <T>(callback: () => T) => {
  const [s, set] = useState(callback());
  useEffect(() => set(callback()));
  return s;
};

export { useState, useEffect, useMemo };
`;

export const app3 = `import { useState, useEffect, useMemo } from "./signal";
import Button from './Button';

function App() {
  console.log('App updated');
  const [count, setCount] = useState(0);

  console.log('App updated');
  useEffect(() => {
    console.log('count is ', count());
  });
  useEffect(() => {
    console.log('effect update');
  });

  const double = useMemo(() => count() * 2);

  return (
    <>
      <Button
        onClick={() => {
          setCount((d) => d + 1);
        }}
      >
        Update {count()}
      </Button>

      <Button disabled>
        Double {double()}
      </Button>
    </>
  );
}

export default App;
`;
