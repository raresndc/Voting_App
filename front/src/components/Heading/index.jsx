import React from "react";

const sizes = {
  headingxs: "text-[16px] font-semibold lg:text-[13px]",
  headings: "text-[18px] font-bold lg:text-[15px]",
  headingmd: "text-[20px] font-semibold lg:text-[17px]",
  headinglg: "text-[50px] font-bold lg:text-[42px] md:text-[46px] sm:text-[40px]",
};

const Heading = ({ children, className = "", size = "headingmd", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-[#f2f2f2] font-['Exo_2'] ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };

