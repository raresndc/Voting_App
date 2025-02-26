import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Button,
} from "@material-tailwind/react";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  EnvelopeOpenIcon,
  ArrowDownIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  FireIcon,
  CpuChipIcon
} from "@heroicons/react/24/solid";

import OnOffComponent from "./config-components/OnOffComponent.tsx";
import CommandComponent from "./config-components/CommandComponent.tsx";
import SendMessagesComponent from "./config-components/SendMessagesComponent.tsx";
import ReceivedMessagesComponent from "./config-components/ReceivedMessagesComponent.tsx";
import { getAllCommands, sendCommandDevice } from "./api/CmdApi.ts";
import StatisticsCard from "components/StatisticsCard.tsx";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { TemperatureIntervalDao, CmdDao } from "./dao/CmdDao.ts";
import { DeviceDao } from "./dao/DeviceDao.ts";
import { getOneDevice } from "./api/DeviceApi.ts";
import Swal from "sweetalert2";
import GlobalState from "session/GlobalState.ts";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import StatisticsCardDevice from "components/StatisticCardDevice.tsx";

export default function ConfigureDevicePage() {

  // id
  const params = useParams();

  const [tempParams, setTempParams] = useState<TemperatureIntervalDao>({tMin: 7, tMax: 17, warmingCoolingMode: true});
  const [device, setDevice] = useState<DeviceDao>({id: 0, deviceMsisdn: "", devicePhone: "", deviceDetails: "", deviceLocation: "", deviceName: "", masterActivated: false, userActivated: false, elRouter: null, elDeviceType: null, masterRouter: null, users : null});
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

  async function statusCommand() {
    
    try{

      var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};

      var commandsDevice: CmdDao[] = extractCommandsForDevice();

      for (var command of commandsDevice) {
        if(command.cmdName === "STATUS") {
          commandSelected = command;
          break;
        }
      }
      
      Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: null});

      Swal.fire({icon: 'success', title: 'Succes!', text: 'Comanda status transmisa cu succes!', allowEscapeKey: false, allowOutsideClick: false})
      
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

  }

  async function temperatureCommand() {
    
    try{

      var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};

      var commandsDevice: CmdDao[] = extractCommandsForDevice();

      for (var command of commandsDevice) {
        if(command.cmdName === "TEMP INFO") {
          commandSelected = command;
          break;
        }
      }
      
      Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: null});

      Swal.fire({icon: 'success', title: 'Succes!', text: 'Comanda info temperatura transmisa cu succes!', allowEscapeKey: false, allowOutsideClick: false})
      
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

  }

  return (
    <>
      <div className="relative mt-8 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3 text-center">
                Comenzi
              </Typography>
              <div className="flex flex-col gap-12 mt-5">

                <div className="flex flex-col gap-6" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  
                    <StatisticsCardDevice                       
                        title={"Priza Selectata este: " + device.deviceName}
                        />
                  
                </div>
                  
                  {
                    (GlobalState.role !== ACCOUNT_TYPES.GUEST) ? 
                    <>
                  <OnOffComponent deviceId={params.id}/>
                   
                  {
                  <Button onClick={() => statusCommand()} color="white">      
                  <StatisticsCard                
                      title={"Status"}
                      color={"blue"}
                      icon={React.createElement(ChartBarIcon, {
                      className: "w-6 h-6 text-white",
                      })}
                      />
                  </Button>  
                  }

                  {
                  <Button onClick={() => temperatureCommand()} color="white">      
                  <StatisticsCard                
                      title={"Temperatura"}
                      color={"yellow"}
                      icon={React.createElement(FireIcon, {
                      className: "w-6 h-6 text-white",
                      })}
                      />
                  </Button>  
                  }

                  {
                    commandComponents.map(({color, icon, title, linkTo}) => (
                      <>
                        <CommandComponent color={color} deviceId={params.id} icon={icon} title={title} linkTo={linkTo + "/" + params.id} />
                      </>
                    ))
                  }</> : ""
                }
              </div>
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3 text-center">
                Comunicatie
              </Typography>
              <ul className="flex flex-col gap-6">
                <SendMessagesComponent iconUp={true} title="Mesaje trimise"/>
                <ReceivedMessagesComponent iconUp={true} title="Mesaje primite"/>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>     
    </>
  );
}

export const commandComponents = [
  {
    color: "brown",
    icon: CogIcon,
    title: "Control temperatura",
    linkTo: "/dashboard/temperature-control-device"   
  },  
  {
    color: "pink",
    icon: BellAlertIcon,
    title: "Alerta Temperatura",
    linkTo: "/dashboard/temperature-alert-device"   
  },
];

