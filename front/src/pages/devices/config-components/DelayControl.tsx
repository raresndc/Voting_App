import { Card, CardHeader, Typography, CardBody, Input, Button, Checkbox } from "@material-tailwind/react";
import GenericDropdown from "components/GenericDropdown.tsx";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { action } from 'mobx';

export default function DelayControl() {

  const [tempParams, setTempParams] = useState({minutes: 7, onOff: true});

    const params = useParams();

    function onChangeRole(e) {
        console.log(e);
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Oprire/Pornire programata
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                    
                        <Input value={tempParams.minutes} onChange={(e) => { setTempParams({... tempParams, minutes: parseInt(e.target.value, 10)})}} type="number" required size="lg" label="Intarziere minute" />
                        <div>
                          <Checkbox checked={tempParams.onOff} onChange={(e) => { setTempParams({... tempParams, onOff: true})}} label="Pornire" />
                          <Checkbox checked={!tempParams.onOff} onChange={(e) => {setTempParams({... tempParams, onOff: false})}} label="Oprire" />
                        </div>
                        
                    </div>
                    <Button className="mt-6" fullWidth>Trimite</Button>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}