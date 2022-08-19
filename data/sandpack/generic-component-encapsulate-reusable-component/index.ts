export const genericApp = `import "./styles.css";
import Child from "./Child";

const testData = {
  name: "xfy",
  age: 18
};

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <div>
        <Child data={testData} name="name" />
      </div>
    </div>
  );
}`;

export const genericChild = `import { useState } from "react";

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

export const hookApp = `import { useForm } from 'react-hook-form';

type Pet = 'Cat' | 'Dog';
type FormData = {
  firstName: string;
  lastName: string;
  favorite: Pet;
};

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="firstname">First name:</label>
          <input type="text" id="firstname" {...register('firstName')} />
        </div>

        <div>
          <label htmlFor="lastname">Last name:</label>
          <input type="text" id="lastname" {...register('lastName')} />
        </div>

        <div>
          <label htmlFor="favorite">Favorite pet:</label>
          <select id="favorite" {...register('favorite')}>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
}`;
