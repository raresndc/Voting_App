import { Card, CardBody, Avatar, Typography, Input, Button, CardHeader, Menu, MenuHandler, MenuItem, MenuList, Select, Option } from "@material-tailwind/react";
import GenericDropdown from "components/GenericDropdown.tsx";
import React, { useEffect, useState } from "react";
import { PaginationModel } from "components/PaginationModel";
import { getAllDeviceTypes } from "../devices-type/api/DeviceTypeApi.ts";
import { DeviceTypeDao } from "../devices-type/dao/DeviceTypeDao.ts";
import { getAllRouters } from "../routers/api/RouterApi.ts";
import { RouterDao } from "pages/routers/dao/RouterDao.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { DeviceDao } from "./dao/DeviceDao.ts";
import { saveDevice } from "./api/DeviceApi.ts";
import Swal from 'sweetalert2';

import './style/DeviceStyles.css'

export default function AddDevicesPage() {

    const [deviceTypes, setDeviceTypes] = useState<PageableTemplate<DeviceTypeDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    const [routers, setRouters] = useState<PageableTemplate<RouterDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    const [device, setDevice] = useState<DeviceDao>({deviceDetails: "", deviceLocation: "", deviceMsisdn: "", devicePhone: "", deviceName: "", masterActivated: false, userActivated: false, elRouter: null, elDeviceType: null, masterRouter: null, id: 0});
    const [repeatPassword, setRepeatPassword] = useState("");
 
    const regexPhoneNumber = new RegExp("^07[0-9]{8}$");

    useEffect(() => {
      readDeviceTypes();
      readRouters();
    },[])

    function readDeviceTypes() {
      getAllDeviceTypes().then(res => setDeviceTypes(res))
    }

    function readRouters() {
      getAllRouters().then(res => setRouters(res))
    }

    function findDeviceType(e) {

      for (let deviceType of deviceTypes.content) {
        if (e === deviceType.deviceTypeName) {
           return deviceType;
        }
      }
        return null;
    }

    function findRouter(e) {

      for (let router of routers.content) {
        if (e === router.routerName) {
           return router;
        }
      }
        return null;
    }

    async function createDevice(ev) {
      // ev.preventDefault();
      try {

          if(!device.deviceName || device.deviceName.length === 0) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul nume trebuie completat!'})
              return
          }       
  
          if(!device.deviceDetails || device.deviceDetails.length === 0) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul detalii trebuie completat!'})
              return
          }

          if(!device.deviceLocation || device.deviceLocation.length === 0) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul locatie trebuie completat!'})
              return
          }

          if(!regexPhoneNumber.test(device.deviceMsisdn)) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Numarul de telefon trebuie sa aiba fix 10 cifre si sa inceapa cu 07!'})
              return
          }
  
          Swal.fire({title: 'Loading ... ', text: 'Asteptati inrolarea medicului.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

          await saveDevice(device);

          Swal.fire({icon: 'success', title: 'Succes!', text: 'Medicul a fost adaugat cu succes!'})

      } catch (err) {
          Swal.fire({icon: 'error', title: 'Error', text: err})
      }
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Create new doctor account
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                    
                        <Input value={device.deviceName} required size="lg" label="Name" onChange={(e) => { setDevice({...device, deviceName: e.target.value})}}/>
                        <Input value={device.deviceDetails} required size="lg" label="Details" onChange={(e) => { setDevice({...device, deviceDetails: e.target.value})}}/>
                        <Input value={device.deviceLocation} required size="lg" label="Location" onChange={(e) => { setDevice({...device, deviceLocation: e.target.value})}}/>
                        <Input maxLength={10} value={device.deviceMsisdn} required size="lg" label="Phone No." onChange={(e) => { setDevice({...device, deviceMsisdn: e.target.value})}}/>     

                        <GenericDropdown array={deviceTypes.content.map(deviceType => deviceType.deviceTypeName)} defaultValue={"Select specialty"} onChange={(e) => {setDevice({...device, elDeviceType: findDeviceType(e)})}} />                     
                        
                    </div>

                    <Button className="buttonRouterAdd" onClick={createDevice} fullWidth>Add candidate</Button>
                    
                    {/* <div className="mb-4 flex flex-col gap-6"> 
                      <button onClick={createDevice} className="buttonDevice">
                        Inrolare
                      </button>
                      
                      </div> */}
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}