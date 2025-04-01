import { Card, CardHeader, Typography, CardBody, Input, Button } from "@material-tailwind/react";
import GenericDropdown from "components/GenericDropdown.tsx";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DeviceTypeDao } from "./dao/DeviceTypeDao.ts";
import { useEffect } from "react";
import { getAllDeviceTypes, updateDeviceType } from "./api/DeviceTypeApi.ts";
import { getOneDeviceType } from "./api/DeviceTypeApi.ts";
import Swal from 'sweetalert2';

import './style/DeviceTypeStyles.css'

export default function ModifyDeviceTypePage() {

    const params = useParams();

    const [deviceType, setDeviceType] = useState<DeviceTypeDao>();


    async function change(ev) {
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

        if(!deviceType.lider || deviceType.lider.length === 0) {
          Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul Detalii trebuie completat!'})
          return
        }

        await updateDeviceType(deviceType);

        Swal.fire({icon: 'success', title: 'Succes!', text: 'Tip specialitate a fost actualizat cu succes!'});
      } catch(err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    useEffect(() => {
      getOneDeviceType(params.id).then(res => setDeviceType(res));
    }, [])

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover">
            <Typography variant="h6" color="gray">
              Modify Political Party
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                    
                        <Input value={deviceType?.deviceTypeName} required size="lg" label="Name" onChange={(e) => setDeviceType({...deviceType, deviceTypeName: e.target.value})} />
                        <Input value={deviceType?.deviceTypeDetails} required size="lg" label="Details" onChange={(e) => setDeviceType({...deviceType, deviceTypeDetails: e.target.value})} />
                        
                        <Input value={deviceType?.lider} required size="lg" label="Leader" onChange={(e) => {setDeviceType({...deviceType, lider: e.target.value})}}/>
                        <Input value={deviceType?.pozitie} required size="lg" label="Pozition" onChange={(e) => {setDeviceType({...deviceType, pozitie: e.target.value})}}/>
                        <Input value={deviceType?.ideologie} required size="lg" label="Ideology" onChange={(e) => {setDeviceType({...deviceType, ideologie: e.target.value})}}/>
                        <Input value={deviceType?.statut} required size="lg" label="Status" onChange={(e) => {setDeviceType({...deviceType, statut: e.target.value})}}/>
                        <Input value={deviceType?.membriiSenat} required size="lg" label="Membrii Senat" onChange={(e) => {setDeviceType({...deviceType, membriiSenat: e.target.value})}}/>
                        <Input value={deviceType?.membriiCamDdep} required size="lg" label="Membrii Camera Deputatilor" onChange={(e) => {setDeviceType({...deviceType, membriiCamDdep: e.target.value})}}/>
                        <Input value={deviceType?.membriiParlaEuro} required size="lg" label="Membrii Parlamentul European " onChange={(e) => {setDeviceType({...deviceType, membriiParlaEuro: e.target.value})}}/>
                    
                    </div>
                    {/* <Button onClick={change} className="mt-6" fullWidth>Modifica</Button> */}

                    <div className="mb-4 flex flex-col gap-6"> 
                      <button onClick={change} className="buttonDeviceType">
                      Modify details
                      </button>
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}