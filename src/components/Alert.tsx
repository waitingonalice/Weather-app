import { Text } from "@/components";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export interface AlertProps {
  show: boolean;
  title: React.ReactNode;
  onClose?: (showNotification: boolean) => void;
  className?: string;
}

export const Alert = ({ show, title, onClose, className }: AlertProps) => {
  const handleOnClose = () => {
    if (onClose) onClose(Boolean(show));
  };

  if (show) {
    return (
      <div
        className={clsx(
          "border-0 rounded-lg bg-error-1 p-3 flex whitespace-nowrap justify-between items-center w-full",
          className
        )}
      >
        <Text
          type="subheadBold"
          className="text-error-2"
          aria-errorMessage={title}
        >
          {title}
        </Text>

        {onClose && (
          <XMarkIcon
            role="button"
            tabIndex={0}
            className="w-5 ml-4 text-error-2"
            onClick={handleOnClose}
          />
        )}
      </div>
    );
  }

  return <></>;
};
