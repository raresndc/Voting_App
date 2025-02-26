import { Card, CardHeader, Typography, CardBody, Input, Button } from "@material-tailwind/react";
import { PaginationModel } from "components/PaginationModel";
import { DeviceTypeDao } from "pages/devices-type/dao/DeviceTypeDao.ts";
import { RouterDao } from "pages/routers/dao/RouterDao.ts";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { DeviceDao, DevicePasswordDao } from "./dao/DeviceDao.ts";
import { getOneDevice, updateDevice, updatePasswordDevice } from "./api/DeviceApi.ts";
import Swal from "sweetalert2";

import './style/DeviceStyles.css'

export default function ModifyDevicePage() {

    const params = useParams();

    const [device, setDevice] = useState<DeviceDao>({deviceDetails: "", deviceLocation: "", deviceMsisdn: "", devicePhone: "", deviceName: "", masterActivated: false, userActivated: false, elRouter: null, elDeviceType: null, masterRouter: null, users: null, id: 0});
    const [devicePassword, setDevicePassword] = useState<DevicePasswordDao>({device: null, password: "", oldPassword: ""});
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    
    const regexPass = new RegExp("[0-9]{4}");
    const regexPhoneNumber = new RegExp("^07[0-9]{8}$");

    useEffect(() => {
      getOneDevice(params.id).then(res => setDevice(res));
      setDevice({...device, devicePhone: device.devicePhone.substring(3, 12)})
      setDevicePassword({...devicePassword, device: device});
    }, [])

    async function change(ev) {
      ev.preventDefault();
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

          if(!regexPhoneNumber.test(device.devicePhone)) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Numarul de telefon trebuie sa aiba fix 10 cifre si sa inceapa cu 07!'})
              return
          }
  
          await updateDevice(device);

          Swal.fire({icon: 'success', title: 'Succes!', text: 'Dispozitivul-ul a fost modificat cu succes!'})

      } catch (err) {
          Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    async function changePassword(ev) {
      ev.preventDefault();
      try {
        Swal.fire({
          title: 'Sigur vrei sa modifici parola pentru dispozitivul \'' + device.deviceName + '\' ?',
          showDenyButton: true,
          confirmButtonText: 'Sunt sigur!',
          denyButtonText: `Nu!`,
        }).then(async (result) => {
          if (result.isConfirmed) {   
            try {            
              if(!regexPass.test(devicePassword.oldPassword)) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Parola veche nu respecta constrangerile. Parola trebuie sa contina 4 cifre!'})
                return
              }
      
              if(!regexPass.test(devicePassword.password)) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Parola noua nu respecta constrangerile. Parola trebuie sa contina 4 cifre!'})
                return
              }
      
              if(devicePassword.password !== repeatNewPassword) {
                  Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul parola nu este acelasi cel de repeta parola!'})
                  return
              }    
      
              await updatePasswordDevice(devicePassword);
              Swal.fire({icon: 'success', title: 'Succes!', text: 'Parola schimbata cu succes!'});
              reloadState();
            } catch (err) {
              Swal.fire({icon: 'error', title: 'Eroare', text: err})
            }
          } else if (result.isDenied) {
            Swal.fire('Parola nu a fost modificata', '', 'info')
          }
        })
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" color="white">
              Modifica device
            </Typography>
            <div>
              <Typography variant="h6" color = "lime" className="mb-1">{device.deviceName}</Typography>
            </div>
        </div>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                        <Input value={device.deviceName} required size="lg" label="Nume" onChange={(e) => { setDevice({...device, deviceName: e.target.value})}}/>
                        <Input value={device.deviceDetails} required size="lg" label="Detalii" onChange={(e) => { setDevice({...device, deviceDetails: e.target.value})}}/>
                        <Input value={device.deviceLocation} required size="lg" label="Locatie" onChange={(e) => { setDevice({...device, deviceLocation: e.target.value})}}/>
                        <Input maxLength={10} value={ (device.deviceMsisdn.length === 13) ?  device.deviceMsisdn.substring(3, device.deviceMsisdn.length) : device.deviceMsisdn} required size="lg" label="Telefon" onChange={(e) => { setDevice({...device, devicePhone: e.target.value, deviceMsisdn: e.target.value})}}/>  
                        {/* <Input maxLength={10} value={(router.routerPhone.length === 13) ? router.routerPhone.substring(3, router.routerPhone.length) : router.routerPhone} required size="lg" label="Numar de telefon" onChange={(e) => { setRouter({...router, routerPhone: e.target.value})}}/> */}
                                                                                   
                        {/* <Button onClick={change} className="mt-6" fullWidth>Modifica</Button> */}

                        <button onClick={change} className="buttonDevice">
                          Modifica
                        </button>

                    </div>
                    
                  
                    <div className="mb-4 flex flex-col gap-6">
                        <Input value={devicePassword.oldPassword} required type="password" size="lg" label="Parola veche" onChange={(e) => {setDevicePassword({...devicePassword, oldPassword: e.target.value})}}/>
                        <Input value={devicePassword.password} required type="password" size="lg" label="Parola noua" onChange={(e) => {setDevicePassword({...devicePassword, password: e.target.value})}}/>
                        <Input value={repeatNewPassword} required type="password" size="lg" label="Repeta parola noua" onChange={(e) => {setRepeatNewPassword(e.target.value)}} />                            
                        {/* <Button onClick={changePassword} className="mt-6" fullWidth>Modifica parola</Button> */}

                        <button onClick={changePassword} className="buttonDevice">
                          Modifica parola
                        </button>

                    </div>
                    
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}

function reloadState() {
  throw new Error("Function not implemented.");
}
