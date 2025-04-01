import { PowerIcon, XCircleIcon, XMarkIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";
import StatisticsCard from "components/StatisticsCard.tsx";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CmdDao, SendCommandDao } from "../dao/CmdDao.ts";
import { getAllCommands, sendCommandDevice } from "../api/CmdApi.ts";
import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { getOneDevice } from "../api/DeviceApi.ts";
import { DeviceDao } from "../dao/DeviceDao.ts";
// import Swal from "sweetalert2";
import Swal, { SweetAlertOptions } from 'sweetalert2';

export default function OnOffComponent({deviceId}) {

    // id
    const params = useParams();

    const [device, setDevice] = useState<DeviceDao>({id: 0, deviceMsisdn: "", devicePhone: "", deviceDetails: "", deviceLocation: "", deviceName: "", masterActivated: false, userActivated: false, elRouter: null, elDeviceType: null, masterRouter: null, users: null});
    const [commands, setCommands] = useState<PageableTemplate<CmdDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});

    useEffect(() => {
      getOneDevice(params.id).then(res => setDevice(res));
      getAllCommands().then(res => setCommands(res))
    }, [])

    function extractCommandsForDevice() {

      var commandsDevice: CmdDao[] = [];

      for (var command of commands.content) {
        //if(command.elDevice?.id === device.id)
        commandsDevice.push(command);
      }

      return commandsDevice;
    }


    // --------------------------------------     POWER OFFF ------------------------------------------------
    async function powerOffDevice() {

      try{

        var commandSelected: CmdDao;

        for (var command of extractCommandsForDevice()) {
          if(command.cmdName === "POWER OFF") {
            commandSelected = command;
            break;
          }
        }
    
        Swal.fire({title: 'Loading ... ', text: 'Asteptati oprirea dispozitivului', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

        await sendCommandDevice({elDevice: device, elCmd: commandSelected, temperatureInterval: null});
        
        Swal.fire({icon: 'success', title: 'Succes!', text: 'Dispozitivul-ul a fost oprit cu succes!', allowEscapeKey: false, allowOutsideClick: false})
        
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
      }
      
    } 

    // --------------------------------------     POWER ON ------------------------------------------------
    async function powerOnDevice() {

      try{

        var commandSelected: CmdDao;

        for (var command of extractCommandsForDevice()) {
          if(command.cmdName === "POWER ON") {
            commandSelected = command;
            break;
          }
        }
        
        Swal.fire({title: 'Loading ... ', text: 'Asteptati pornirea dispozitivului', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

        await sendCommandDevice({elDevice: device, elCmd: commandSelected, temperatureInterval: null});

        Swal.fire({icon: 'success', title: 'Succes!', text: 'Dispozitivul-ul a fost pornit cu succes!', allowEscapeKey: false, allowOutsideClick: false})
        
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
      }
    
    } 

    return <div className="grid grid-cols-2">
                      
                  <Button onClick={() => powerOffDevice()} color="white">
                    <StatisticsCard
                      color="red"
                      key={"key 1"}
                      icon={React.createElement(XCircleIcon, {
                        className: "w-6 h-6 text-white",
                      })}
                      footer={
                        <Typography className="font-normal text-blue-gray-600">
                          <strong className="text-red-500">Cancel appointment</strong>
                        </Typography>
                      }
                    />
                  </Button>

                  <Button onClick={() => powerOnDevice()} color="white">
                    <StatisticsCard
                      color="green"
                      key={"key 2"}
                      icon={React.createElement(CheckCircleIcon, {
                        className: "w-6 h-6 text-white",
                      })}
                      footer={
                        <Typography className="font-normal text-blue-gray-600">
                          <strong className="text-green-500">Verify appointment</strong>
                        </Typography>
                      }
                    />
                  </Button>
    </div>
}