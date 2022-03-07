import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import cn from 'classnames';

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const RUAInput = forwardRef<HTMLInputElement, Props>(
  (
    { className, placeholder, value, onChange, onKeyUp, type, ...rest },
    ref
  ) => {
    return (
      <>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={cn(
            'rounded-lg outline-none relative',
            'py-4 px-4 placeholder:font-semibold',
            'focus:shadow-lg focus:placeholder:font-normal',
            'transition-all focus:z-20',
            'dark:bg-rua-gray-800',
            className
          )}
          value={value}
          onChange={onChange}
          onKeyUp={onKeyUp}
          {...rest}
        />
      </>
    );
  }
);

RUAInput.displayName = 'RUAInput';

export default RUAInput;
