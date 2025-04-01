import { Card, CardBody, Avatar, Typography, Input, Button, CardHeader, Menu, MenuHandler, MenuItem, MenuList, Select, Option } from "@material-tailwind/react";
import GenericDropdown from "components/GenericDropdown.tsx";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import { RouterDao } from "./dao/RouterDao.ts";
import { saveRouter } from "./api/RouterApi.ts";

import './style/RoutersStyles.css'

export default function AddRouterPage() {

    const [router, setRouter] = useState<RouterDao>({tipRouter: "", routerName: "", routerDetails: "", routerSyntax: "", routerIp: "", routerUsername: "", routerPassword: "", communicationDeviceRouter: false, routerPhone: "", id: 0});
    const [repeatPassword, setRepeatPassword] = useState("");

    const regexPass = new RegExp("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}");
    const regexPhoneNumber = new RegExp("^07[0-9]{8}$");
    const regexIp = new RegExp("((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}");


    function onChangeRouterType(e) {
        if(e === "router")
          setRouter({...router, tipRouter: "router"});
        else
          setRouter({...router, tipRouter: "switch"});
      if(e === "server")
        setRouter({...router, tipRouter: "server"});
    }

    function onChangeNetworkDeviceType(e) {
      if(e === "Network")
        setRouter({...router, communicationDeviceRouter: true});
      else
        setRouter({...router, communicationDeviceRouter: false});
  }

    async function createRouter(ev) {
      ev.preventDefault();
      try {

          if(!router.routerName || router.routerName.length === 0) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul nume trebuie completat!'})
              return
          }
  
          if(!regexPass.test(router.routerPassword)) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Parola nu respecta constrangerile. Litera mica, litera mare, cifra, caracter special(#?!@$%^&*-_) si dimensiune minim 8 caractere, dimensiune maxima 24 de caractere!'})
              return
          }

          if(router.routerPassword !== repeatPassword) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul parola nu este acelasi cel de repeta parola!'})
              return
          }
  
          if(!router.routerDetails || router.routerDetails.length === 0) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul detalii trebuie completat!'})
              return
          }

          if(!router.routerSyntax || router.routerSyntax.length === 0) {
            Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul sintaxa trebuie completat!'})
            return
          }

          if(!regexIp.test(router.routerIp)) {
            Swal.fire({icon: 'error', title: 'Eroare', text: 'Adresa Ip nu este valida!'})
            return
          }

          if(!regexPhoneNumber.test(router.routerPhone)) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Numarul de telefon trebuie sa aiba fix 10 cifre si sa inceapa cu 07!'})
              return
          }
          Swal.fire({title: 'Loading ... ', text: 'Asteptati inrolarea routerului.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})
  
          await saveRouter(router);

          Swal.fire({icon: 'success', title: 'Succes!', text: 'Router-ul a fost adaugat cu succes!'})

      } catch (err) {
          Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
  }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover">
            <Typography variant="h6" color="white">
              Add new network device
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                        {/* <Input value={router.tipRouter} required size="lg" label="Tip dispozitiv" onChange={(e) => { setRouter({...router, tipRouter: e.target.value})}}/> */}
                        <GenericDropdown array={["router", "switch", "server"]} defaultValue={"Select network device"} onChange={(e) => {onChangeRouterType(e)}} />
                        <Input value={router.routerName} required size="lg" label="Name" onChange={(e) => { setRouter({...router, routerName: e.target.value})}}/>
                        <Input value={router.routerDetails} required size="lg" label="Details" onChange={(e) => { setRouter({...router, routerDetails: e.target.value})}}/>
                        <Input value={router.routerSyntax} required size="lg" label="Sintax" onChange={(e) => { setRouter({...router, routerSyntax: e.target.value})}}/>
                        <Input value={router.routerIp} required size="lg" label="Ip" onChange={(e) => { setRouter({...router, routerIp: e.target.value})}}/>
                        <Input value={router.routerUsername} required size="lg" label="User" onChange={(e) => {setRouter({...router, routerUsername: e.target.value})}}/>
                        <Input value={router.routerPassword} required type="password" size="lg" label="Password" onChange={(e) => {setRouter({...router, routerPassword: e.target.value})}}/>
                        <Input value={repeatPassword} required type="password" size="lg" label="Repeat password" onChange={(e) => {setRepeatPassword(e.target.value)}} />
                        <Input value={router.routerPhone} required size="lg" label="Phone No" onChange={(e) => { setRouter({...router, routerPhone: e.target.value})}}/>
                        
                        <GenericDropdown array={["Network", "Notifications"]} defaultValue={"Select communication type"} onChange={(e) => {onChangeRouterType(e)}} />
                        
                    </div>
                    {/* <Button onClick={createRouter} className="mt-6 bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover" fullWidth>Inrolare</Button> */}

                    <div className="mb-4 flex flex-col gap-6"> 
                      <button onClick={createRouter} className="buttonDeviceType">
                      Enroll 
                      </button>
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}