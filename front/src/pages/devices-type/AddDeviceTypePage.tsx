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
          Swal.fire({icon: 'error', title: 'Error', text: 'Name field must be filled in!'})
          return
        }

        

        if(!deviceType.deviceTypeDetails || deviceType.deviceTypeDetails.length === 0) {
          Swal.fire({icon: 'error', title: 'Error', text: 'Details field must be filled in!'})
          return
        }

        Swal.fire({title: 'Loading ... ', text: 'Wait for political party registration.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

        await saveDeviceType(deviceType);

        Swal.fire({icon: 'success', title: 'Success!', text: 'Political party added successfully!'});
      } catch(err) {
        Swal.fire({icon: 'error', title: 'Error', text: err})
      }
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover">
            <Typography variant="h6" color="gray">
              Add new political party
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                    {/* onChange={(e) => {setCredentials({... credentials, username: e.target.value})}} */}
                        <Input value={deviceType.deviceTypeName} required size="lg" label="Name" onChange={(e) => {setDeviceType({...deviceType, deviceTypeName: e.target.value})}} />
                        <Input value={deviceType.deviceTypeDetails} required size="lg" label="Details" onChange={(e) => {setDeviceType({...deviceType, deviceTypeDetails: e.target.value})}}/>
                        
                        <Input value={deviceType.lider} required size="lg" label="Leader" onChange={(e) => {setDeviceType({...deviceType, lider: e.target.value})}}/>
                        <Input value={deviceType.pozitie} required size="lg" label="Pozition" onChange={(e) => {setDeviceType({...deviceType, pozitie: e.target.value})}}/>
                        <Input value={deviceType.ideologie} required size="lg" label="Ideology" onChange={(e) => {setDeviceType({...deviceType, ideologie: e.target.value})}}/>
                        <Input value={deviceType.statut} required size="lg" label="Status" onChange={(e) => {setDeviceType({...deviceType, statut: e.target.value})}}/>
                        <Input value={deviceType.membriiSenat} required size="lg" label="Membrii Senat" onChange={(e) => {setDeviceType({...deviceType, membriiSenat: e.target.value})}}/>
                        <Input value={deviceType.membriiCamDdep} required size="lg" label="Membrii Camera Deputatilor" onChange={(e) => {setDeviceType({...deviceType, membriiCamDdep: e.target.value})}}/>
                        <Input value={deviceType.membriiParlaEuro} required size="lg" label="Membrii Parlamentul European " onChange={(e) => {setDeviceType({...deviceType, membriiParlaEuro: e.target.value})}}/>
                    </div>
                    {/* <Button onClick={create} className="mt-6" fullWidth>Adaugare</Button> */}

                    <div className="mb-4 flex flex-col gap-6"> 
                      <button onClick={create}className="buttonDeviceType">
                      Add political party
                      </button>
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}