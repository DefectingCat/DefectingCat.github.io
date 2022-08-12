const app = `import "./styles.css";
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

export default app;
