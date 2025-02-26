import { Card, CardBody, Avatar, Typography, Button, Input, CardHeader, Checkbox ,Switch, MenuHandler, IconButton, Menu, MenuList, MenuItem } from "@material-tailwind/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { changeNotificationsStatusApi, changePasswordApi, getCurrentUserApi, changePhoneNumberByUserApi } from "session/BackendApi.ts";
import GlobalState from "session/GlobalState.ts";
import { CreateUserDao, UserDao } from "session/dao/Dao.ts";
import Swal from "sweetalert2";
import { Collapse } from 'react-collapse';
import { PaginationModel } from "components/PaginationModel";
import { PageableTemplate } from "session/dao/PageableDao";
import { RouterDao } from "pages/routers/dao/RouterDao";
import { BellIcon, ClockIcon, CreditCardIcon, WifiIcon } from "@heroicons/react/24/solid";

import './style/ProfileStyles.css'

export default function Profile() {

  const [createUser, setCreateUser] = useState<CreateUserDao>({newPassword: "", role: "", username: GlobalState.username, phoneNumberString: "", oldPassword: "", notificationSms: null});
  const [user, setUser] = useState<UserDao>();

  const [repeatPassword, setRepeatPassword] = useState("");

  const regexPass = new RegExp("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}");
  const regexPhoneNumber = new RegExp("^[0-9]{10}$");

  const [isChecked, setIsChecked] = useState(user?.notificationSms);



  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(cur => !cur);

  const [collapseOpen, setCollapseOpen] = useState(false);
  
  const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  const toggleCollapse = () => {
      reloadState();
      setCollapseOpen(!collapseOpen);
  };

  useEffect(() => {
  },[modifyState, pagination])

  function reloadState() {
    setModifyState(!modifyState);
  }

 


  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const label = isChecked ? "Notificari activate" : "Notificari dezactivate";
  

  useEffect(() => {
    getCurrentUserApi().then(res => setUser(res));
  }, [])


  async function modifyPassword(ev) {
    ev.preventDefault();
    try {

        if(!regexPass.test(createUser.newPassword)) {
            Swal.fire({icon: 'error', title: 'Eroare', text: 'Parola nu respecta constrangerile. Litera mica, litera mare, cifra, caracter special(#?!@$%^&*-_) si dimensiune minim 8 caractere, dimensiune maxima 24 de caractere!', allowEscapeKey: false, allowOutsideClick: false})
            return
        }

        if(createUser.newPassword !== repeatPassword) {
            Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul parola nu este acelasi cel de repeta parola!', allowEscapeKey: false, allowOutsideClick: false})
            return
        }

        Swal.fire({title: 'Loading ... ', text: 'Asteptati modificarea parolei.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

        await changePasswordApi(createUser);
    
        Swal.fire({icon: 'success', title: 'Succes!', text: 'Parola a fost modificata cu succes!', allowEscapeKey: false, allowOutsideClick: false})

        

    } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

  }

  async function modifyNotifications(ev) {
    ev.preventDefault();
    try {

      Swal.fire({title: 'Loading ... ', text: 'Asteptati modificarea statusului.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await changeNotificationsStatusApi({notificationSms: user?.notificationSms, username: user?.username});
  
      Swal.fire({icon: 'success', title: 'Succes!', text: 'Status notificari a fost modificat cu succes!'})

      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Succes!',
      //   text: 'Status notificari a fost modificat cu succes!',
      //   showConfirmButton: false,
      //   timer: 1500, 
      //   allowEscapeKey: false, 
      //   allowOutsideClick: false
      // })

    } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

    } 

    async function modifyPhoneNumber(ev) {
      ev.preventDefault();
      try {

          if(!regexPhoneNumber.test(user.phoneNumberString)) {
              Swal.fire({icon: 'error', title: 'Eroare', text: 'Numarul de telefon trebuie sa aiba fix 10 cifre!', allowEscapeKey: false, allowOutsideClick: false})
              return
          }
          Swal.fire({title: 'Loading ... ', text: 'Asteptati modificarea numarului de telefon.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

          await changePhoneNumberByUserApi(user);

          Swal.fire({icon: 'success', title: 'Succes!', text: 'Numarul de telefon a fost modificat cu succes!', allowEscapeKey: false, allowOutsideClick: false})

          
      } catch (err) {
          Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
      }
  }

    return (
      <>
        <Card className="mx-3 mt-10 mb-6 lg:mx-4">
          
        <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
          <Typography variant="h6" color="white">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Credentiale</span>
              <div>
                <Typography variant="h6" color = "lime" className="mb-1">
                  {GlobalState.username}
                </Typography>
                <Typography variant="small" className="font-normal text-amber-400" >
                  {GlobalState.role}
                </Typography>
                
              </div>
            </div>
          </Typography>

        </CardHeader>
        
          <CardBody className="p-4">

          

            <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
              
                <form className="mt-1 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                        <div className="mb-4 flex flex-col gap-6"  > 

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Typography variant="h5" color="blue-gray-500" className="mb-1">Schimbare parola</Typography>
                            </div>
            
                              <Input value={createUser.oldPassword} type="password" size="lg" label="Parola veche" onChange={(e) => {setCreateUser({...createUser, oldPassword: e.target.value})}}/>
                              <Input value={createUser.newPassword} type="password" size="lg" label="Parola noua" onChange={(e) => {setCreateUser({...createUser, newPassword: e.target.value})}}/>
                              <Input value={repeatPassword} type="password" size="lg" label="Repeta parola noua" onChange={(e) => {setRepeatPassword(e.target.value)}}/>

                              
                            <div>
                              {/* <Button onClick={modifyPassword} className="mt-6 bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover" fullWidth>Modifica</Button> */}
                              <div className="mb-4 flex flex-col gap-6"> 
                                <button onClick={modifyPassword}  className="buttonProfile">
                                Modifica
                                </button>
                              </div>

                              <div>
                                <div className="mb-4 mt-10 flex flex-col gap-6"> 
                                  <Input maxLength={10} value={user?.phoneNumberString} required size="lg" label="Numar telefon" onChange={(e) => {setUser({...user, phoneNumberString: e.target.value})  }}  />
                                </div>

                                  {/* <Button onClick={modifyPhoneNumber} className="mt-6 bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover" fullWidth>Modifica numar de telefon</Button> */}
                                  
                                  <div className="mb-4 flex flex-col gap-6"> 
                                    <button onClick={modifyPhoneNumber} className="buttonProfile">
                                      
                                    Modifica numar de telefon
                                    </button>
                                  </div>

                              </div>
                          </div>

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              <Checkbox defaultChecked
                                ripple={true}
                                className="squared-full w-6 h-6 hover:before:opacity-0 hover:scale-105 bg-blue-gray-100/25 border-blue-gray-500/50 transition-all" 
                                checked={user?.notificationSms} onChange={(e) => { setUser({ ...user, notificationSms: !(user?.notificationSms) }) }} label="Notificare prin SMS" />
                              {/* <Button onClick={modifyNotifications} className="mt-6 bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover" style={{ fontSize: "12px", padding: "13px 10px", width: "170px", marginTop: "0" }} fullWidth> Modifica notificari </Button>  */}
                              
                              <button onClick={modifyNotifications} className="buttonProfile">
                                
                                Modifica notificari
                              </button>
                            
                            </div>
                      
                        </div>
     
                </form>
            </div>
          </CardBody>


        </Card>
      </>
    );
  }