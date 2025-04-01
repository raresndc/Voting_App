import React from "react";

const sizes = {
  textxs: "text-[13px] font-normal not-italic",
  texts: "text-[14px] font-normal not-italic",
  textmd: "text-[18px] font-normal not-italic lg:text-[15px]",
  textlg: "text-[20px] font-normal not-italic lg:text-[17px]",
  textxl: "text-[36px] font-light lg:text-[30px] md:text-[34px] sm:text-[32px]",
  text2xl: "text-[50px] font-light lg:text-[42px] md:text-[46px] sm:text-[40px]",
};

const Text = ({ children, className = "", as, size = "text2xl", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-[#f2f2f2] font-['Exo_2'] ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };

