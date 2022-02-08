function debounce<Params extends any[]>(
  func: (...args: Params) => void,
  ms: number
) {
  let timeout: NodeJS.Timeout;
  return function (this: unknown, ...args: Params) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
}

export default debounce;
