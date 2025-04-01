import { Card, CardHeader, Typography, CardBody, Input, Button, Checkbox } from "@material-tailwind/react";
import GenericDropdown from "components/GenericDropdown.tsx";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { action } from 'mobx';
import { DeviceDao } from "../dao/DeviceDao.ts";
import { getOneDevice } from "../api/DeviceApi.ts";
import Swal from "sweetalert2";
import { getAllCommands, sendCommandDevice } from "../api/CmdApi.ts";
import { CmdDao, SendCommandDao, TemperatureIntervalDao } from "../dao/CmdDao.ts";
import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";

export default function TemperatureControlCommand() {

    // id
    const params = useParams();
  
    const [tempParams, setTempParams] = useState<TemperatureIntervalDao>({tMin: 7, tMax: 17, warmingCoolingMode: true});
    const [device, setDevice] = useState<DeviceDao>({id: 0, deviceMsisdn: "", devicePhone: "", deviceDetails: "", deviceLocation: "", deviceName: "", devicePassword: "", masterActivated: false, userActivated: false, elRouter: null, elDeviceType: null, masterRouter: null});
    const [commands, setCommands] = useState<PageableTemplate<CmdDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});

    useEffect(() => {
      getOneDevice(params.id).then(res => setDevice(res));
      getAllCommands().then(res => setCommands(res));
    }, [])
    
    function extractCommandsForDevice() {

      var commandsDevice: CmdDao[] = [];

      for (var command of commands.content) {
        //if(command.elDevice?.id === device.id)
        commandsDevice.push(command);
      }

      return commandsDevice;
    }

    async function controlTemperatureDevice() {

      try{

        var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};
        var coolingHeatingOption: string;

        if(tempParams.warmingCoolingMode)
          coolingHeatingOption = "TEMP WARMING INTERVAL";
        else
          coolingHeatingOption = "TEMP COOLING INTERVAL";

        var commandsDevice: CmdDao[] = extractCommandsForDevice();

        for (var command of commandsDevice) {
          if(command.cmdName === coolingHeatingOption) {
            commandSelected = command;
            break;
          }
        }

        Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})
        
        await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: tempParams});

        Swal.fire({icon: 'success', title: 'Succes!', text: 'Temperatura a fost setata in intervalul selectat!', allowEscapeKey: false, allowOutsideClick: false})
        
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
      }
      
    }

    async function stopTemperatureControlDevice() {

      try{

        var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};
      
        var commandsDevice: CmdDao[] = extractCommandsForDevice();

        for (var command of commandsDevice) {
          if(command.cmdName === "TEMP WARMING/COOLING OFF") {
            commandSelected = command;
            break;
          }
        }
        
        Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

        await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: tempParams});

        Swal.fire({icon: 'success', title: 'Succes!', text: 'Controlul temperaturii a fost oprit!', allowEscapeKey: false, allowOutsideClick: false})
        
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
      }

    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Control temperatura
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                        <Input onChange={(e) => {  setTempParams({... tempParams, tMax: parseInt(e.target.value, 10)})}} value={tempParams.tMax} type="number" required size="lg" label="Temperatura maxima" />
                        <Input onChange={(e) => {  setTempParams({... tempParams, tMin: parseInt(e.target.value, 10)})}} value={tempParams.tMin} type="number" required size="lg" label="Temperatura minima " />
                        <div>
                          {/* <Checkbox checked={tempParams.warmingCoolingMode} onChange={(e) => {setTempParams({... tempParams, warmingCoolingMode: Boolean(e.target.value)})}} label="Modul de incalzie" />
                          <Checkbox checked={!tempParams.warmingCoolingMode} onChange={(e) => {setTempParams({... tempParams, warmingCoolingMode: Boolean(e.target.value)})}} label="Modul de racire" />           */}
                        <Checkbox checked={tempParams.warmingCoolingMode} onChange={(e) => {setTempParams({... tempParams, warmingCoolingMode: Boolean(e.target.value)})}} label="Analize sange" />
                        <Checkbox checked={!tempParams.warmingCoolingMode} onChange={(e) => {setTempParams({... tempParams, warmingCoolingMode: Boolean(e.target.value)})}} label="Alte analize" />  
                        </div>
 
                    </div>
                    <div>
                    <Button onClick={controlTemperatureDevice} className="mt-6" fullWidth>Trimite</Button>
                    {/* <Button onClick={stopTemperatureControlDevice} className="mt-6" fullWidth>Opreste Control Temperatura</Button>*/}
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}