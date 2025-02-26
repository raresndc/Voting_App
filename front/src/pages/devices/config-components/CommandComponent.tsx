import { ChartBarIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";
import StatisticsCard from "components/StatisticsCard.tsx";
import React from "react";
import { Link } from "react-router-dom";

export default function CommandComponent({deviceId, icon, color, title, linkTo}) {

    return <>   
        <Button color="white">
            <Link to={linkTo}>      
                <StatisticsCard
                    key={title}
                    title={title}
                    color={color}
                    icon={React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                    })}
                    />
            </Link>  
        </Button>
    </>
}