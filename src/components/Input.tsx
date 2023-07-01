import clsx from "clsx";
import { useState, useRef } from "react";
import { Text } from "./Text";

interface InputProps {
  label?: string;
  value: string;
  className?: string;
  inputClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
}
/** Controlled input component */
export const Input = ({
  label,
  value,
  className,
  inputClassName,
  onChange,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const labelOnTop = isFocus || value;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
  };
  const handleOnFocus = () => setIsFocus(true);
  const handleOnBlur = () => setIsFocus(false);
  const handleOnClick = () => inputRef.current?.focus();

  return (
    <div
      className={clsx(
        "relative flex",
        labelOnTop ? "items-start" : "items-center",

        className
      )}
    >
      <div
        className={clsx(
          "absolute pl-5 text-black opacity-40 cursor-text",
          labelOnTop && "pt-1"
        )}
        onClick={handleOnClick}
        tabIndex={0}
        role="button"
      >
        <Text aria-label={label} type={labelOnTop ? "caption" : "subhead"}>
          {label}
        </Text>
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        className={clsx(
          inputClassName,
          "text-black bg-white-20 p-5 rounded-2xl w-full text-base leading-[21.79px] focus:outline-none"
        )}
      />
    </div>
  );
};
