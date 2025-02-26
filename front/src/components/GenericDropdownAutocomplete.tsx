import { Select, Option } from "@material-tailwind/react";
import React, {useState, useEffect} from "react";

export default function GenericDropdownAutocomplete({array, onChange, defaultValue}: {array: any[], onChange: (selectedValue: string) => void, defaultValue?: any}) {
    
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    return <div>
    
        <Select  label={defaultValue} value={selectedValue} onChange={onChange} size="lg">
            {
                array.map(item => (<Option key={item} value={item}>{item}</Option> ))
            }
       </Select>
    </div>


}