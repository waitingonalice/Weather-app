import clsx from "clsx";
import React from "react";

interface TextProps {
  children: React.ReactNode;
  type: "h1" | "subheadBold" | "subhead" | "body" | "caption";
  className?: string;
}
type MappingType = {
  [key in TextProps["type"]]: string;
};

const typeMapping: MappingType = {
  h1: "h1",
  subheadBold: "p",
  subhead: "p",
  body: "p",
  caption: "p",
};

const classMapping: MappingType = {
  h1: "text-[81px] font-bold",
  subheadBold: "text-base font-bold leading-[21.79px]",
  subhead: "text-base leading-[21.79px]",
  body: "text-[14px] leading-[19.07px]",
  caption: "text-[10px] leading-[13.62px]",
};

export const Text = ({ children, type, className }: TextProps) => {
  const createElementType = typeMapping[type];
  const classType = classMapping[type];

  return React.createElement(
    createElementType,
    {
      className: clsx(classType, className),
    },
    children
  );
};
