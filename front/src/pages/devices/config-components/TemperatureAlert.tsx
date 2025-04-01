import { Card, CardHeader, Typography, CardBody, Input, Button, Checkbox } from "@material-tailwind/react";
import { PaginationModel } from "components/PaginationModel.ts";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import Swal from "sweetalert2";
import { getAllCommands, sendCommandDevice } from "../api/CmdApi.ts";
import { getOneDevice } from "../api/DeviceApi.ts";
import { SendCommandDao, CmdDao, TemperatureIntervalDao } from "../dao/CmdDao.ts";
import { DeviceDao } from "../dao/DeviceDao.ts";

export default function TemperatureAlert() {

  // id
  const params = useParams();
    
  const [sendSms, setSendSms] = useState<SendCommandDao>({elDevice: null, elCmd: null, temperatureInterval: null}); 
  
  const [tempParams, setTempParams] = useState<TemperatureIntervalDao>({tMin: 7, tMax: 17, warmingCoolingMode: false});
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

  async function temperatureAlertDevice() {

    try{

      var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};

      var commandsDevice: CmdDao[] = extractCommandsForDevice();

      for (var command of commandsDevice) {
        if(command.cmdName === "TEMP ALERT INTERVAL") {
          commandSelected = command;
          break;
        }
      }
      
      Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: tempParams});

      Swal.fire({icon: 'success', title: 'Succes!', text: 'Alerta interval temperatura setata!', allowEscapeKey: false, allowOutsideClick: false})
      
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }
    
  }

  async function stopTemperatureAlertDevice() {

    try{

      var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};
    
      var commandsDevice: CmdDao[] = extractCommandsForDevice();

      for (var command of commandsDevice) {
        if(command.cmdName === "TEMP ALERT OFF") {
          commandSelected = command;
          break;
        }
      }
      
      Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: tempParams});

      Swal.fire({icon: 'success', title: 'Succes!', text: 'Alerta pentru temperatura a fost oprita!',allowEscapeKey: false, allowOutsideClick: false})
      
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

  }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Alerta temperatura
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                        <Input value={tempParams.tMax} onChange={(e) => {setTempParams({... tempParams, tMax: parseInt(e.target.value, 10)})}} type="number" required size="lg" label="Temperatura maxima" />
                        <Input value={tempParams.tMin} onChange={(e) => {setTempParams({... tempParams, tMin: parseInt(e.target.value, 10)})}} type="number" required size="lg" label="Temperatura minima " />
                    </div>
                    <div>
                    <Button onClick={temperatureAlertDevice} className="mt-6" fullWidth>Trimite</Button>
                    <Button onClick={stopTemperatureAlertDevice} className="mt-6" fullWidth>Opreste Control Temperatura</Button> 
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}