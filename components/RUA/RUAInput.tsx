import {
  ChangeEventHandler,
  FC,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  LegacyRef,
} from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
  ref?: LegacyRef<HTMLInputElement> | undefined;
  placeholder?: string;
  value?: string | number | readonly string[] | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement> | undefined;
}

const RUAInput: FC<Props> = ({
  className,
  ref,
  placeholder,
  value,
  onChange,
  onKeyUp,
  type,
}) => {
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
      />
    </>
  );
};

export default RUAInput;
