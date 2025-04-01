import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-lg",
};
const variants = {
  outline: {
    gray_100: "border-[#f2f2f2] border-[1.12px] border-solid text-[#f2f2f2]",
  },
  fill: {
    yellow_700: "bg-[#fdba30] text-[#144880]",
    gray_100: "bg-[#f2f2f2] text-[#144880]",
  },
};
const sizes = {
  xs: "h-[34px] px-3.5 text-[12px]",
  sm: "h-[38px] px-4 text-[12px]",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "sm",
  color = "gray_100",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap uppercase text-[12px] font-bold rounded-lg ${shape && shapes[shape]} ${size && sizes[size]} ${variant && variants[variant]?.[color]}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    shape: PropTypes.oneOf(["round"]),
    size: PropTypes.oneOf(["xs", "sm"]),
    variant: PropTypes.oneOf(["outline", "fill"]),
    color: PropTypes.oneOf(["gray_100", "yellow_700"]),
  };
  
  export { Button };
  
  