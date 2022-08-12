const child = `import { useState } from "react";

type Props<T extends Record<string, unknown>> = {
  name: keyof T;
  data: T;
};

const Child = <T extends Record<string, unknown>>({ name, data }: Props<T>) => {
  const [showName, setShowName] = useState<T[keyof T]>();
  const valid = () => {
    console.log(data[name]);
    setShowName(data[name]);
  };

  return (
    <>
      <div>{name}</div>
      <button onClick={valid}>Show {name}</button>

      <div>{JSON.stringify(showName)}</div>
    </>
  );
};

export default Child;`;

export default child;
