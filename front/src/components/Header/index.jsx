import { Text } from "components/Text";
import { Button } from "components/Button";
import { Img } from "components/Img";
import React from "react";

export default function Header({ ...props }) {
  return (
    <header {...props} className={`${props.className} flex sm:flex-col justify-between items-center gap-5`}>
      <div className="flex items-start gap-6">
        <a href="#">
          <Img src="images/img_settings_black_900.svg" alt="Settings" className="mb-1.5 h-[44px]" />
        </a>
        <Text size="text2xl" as="p" className="self-end text-[36px] font-light uppercase md:text-[34px] sm:text-[32px]">
          nume aplicație
        </Text>
      </div>
      <div className="flex items-center gap-[18px]">
        <div className="mb-1 flex items-center gap-1 self-end rounded-md bg-[#536271] p-1">
          <Img src="images/img_255px_flag_of_t.png" alt="255pxflagoft" className="h-[8px] object-cover" />
          <Text size="textxs" as="p" className="text-[11.86px] font-normal !text-[#ffffff99]">
            EN
          </Text>
        </div>
        <Button shape="round" className="min-w-[90px] rounded-lg px-3 font-bold uppercase">
          new file
        </Button>
      </div>
    </header>
  );
}
