import clsx from "clsx";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

interface ButtonProps {
  onClick: () => void;
  type:
    | "primaryDelete"
    | "secondaryDelete"
    | "primarySearch"
    | "secondarySearch";
  disabled?: boolean;
  className?: string;
}

type MappingType = {
  [key in ButtonProps["type"]]: React.ReactNode;
};

const buttonStyleMapping: MappingType = {
  primarySearch:
    "bg-primary rounded-[20px] w-[60px] h-[60px] enabled:active:bg-violet-900",
  secondarySearch:
    "bg-white rounded-[50%] h-[32px] w-[32px] enabled:active:bg-gray-300 drop-shadow-md",
  primaryDelete:
    "bg-primary rounded-[20px] w-[60px] h-[60px] enabled:active:bg-violet-900",
  secondaryDelete:
    "bg-white rounded-[50%] h-[32px] w-[32px] enabled:active:bg-gray-300 drop-shadow-md",
};
const buttonIconMapping: MappingType = {
  primarySearch: (
    <MagnifyingGlassIcon className="text-white w-[34px] h-[34px]" />
  ),
  secondarySearch: <MagnifyingGlassIcon className="text-slate w-4 h-4" />,
  primaryDelete: <TrashIcon className="text-white w-[34px] h-[34px]" />,
  secondaryDelete: <TrashIcon className="text-slate w-4 h-4" />,
};

export const Button = ({ onClick, type, disabled, className }: ButtonProps) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(
        "flex items-center justify-center transition-all duration-100 ease-in-out disabled:cursor-not-allowed disabled:opacity-30",
        buttonStyleMapping[type],
        className
      )}
      onClick={handleOnClick}
    >
      {buttonIconMapping[type]}
    </button>
  );
};
