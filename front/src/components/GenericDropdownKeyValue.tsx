import { Select, Option } from "@material-tailwind/react";
import React from "react";

export default function GenericDropdown({array, onChange, defaultValue}: {array: any[], onChange: any, defaultValue?: any}) {

    return <div>
        <Select label={defaultValue} onChange={onChange} size="lg">
            {
                array.map(item => (<Option key={item} value={item}>{item}</Option> ))
            }
       </Select>
    </div>
}