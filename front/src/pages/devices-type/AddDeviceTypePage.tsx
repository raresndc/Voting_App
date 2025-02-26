import { Card, CardBody, Avatar, Typography, Input, Button, CardHeader, Menu, MenuHandler, MenuItem, MenuList, Select, Option } from "@material-tailwind/react";
import React, { useState } from "react";
import { DeviceTypeDao } from './dao/DeviceTypeDao.ts';
import Swal from 'sweetalert2';
import {saveDeviceType } from "./api/DeviceTypeApi.ts";

import './style/DeviceTypeStyles.css'

export default function AddDeviceTypePage() {

    const [deviceType, setDeviceType] = useState<DeviceTypeDao>({deviceTypeDetails: "", deviceTypeName: "", id: 0});

    async function create(ev) {
      ev.preventDefault();
      try {
        if(!deviceType.deviceTypeName || deviceType.deviceTypeName.length === 0) {
          Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul Tip trebuie completat!'})
          return
        }

        if(!deviceType.deviceTypeDetails || deviceType.deviceTypeDetails.length === 0) {
          Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul Detalii trebuie completat!'})
          return
        }

        Swal.fire({title: 'Loading ... ', text: 'Asteptati inrolarea tipului de dispozitiv.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

        await saveDeviceType(deviceType);

        Swal.fire({icon: 'success', title: 'Succes!', text: 'Tip device adaugat cu succes!'});
      } catch(err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Adaugare Tip Dispozitiv
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                    {/* onChange={(e) => {setCredentials({... credentials, username: e.target.value})}} */}
                        <Input value={deviceType.deviceTypeName} required size="lg" label="Tip" onChange={(e) => {setDeviceType({...deviceType, deviceTypeName: e.target.value})}} />
                        <Input value={deviceType.deviceTypeDetails} required size="lg" label="Detalii" onChange={(e) => {setDeviceType({...deviceType, deviceTypeDetails: e.target.value})}}/>
                        
                    </div>
                    {/* <Button onClick={create} className="mt-6" fullWidth>Adaugare</Button> */}

                    <div className="mb-4 flex flex-col gap-6"> 
                      <button onClick={create}className="buttonDeviceType">
                      Adaugare
                      </button>
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}