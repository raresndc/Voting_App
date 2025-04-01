import { Card, CardBody, Avatar, Typography, Input, Button, CardHeader, Menu, MenuHandler, MenuItem, MenuList, Select, Option } from "@material-tailwind/react";
import GenericDropdown from "components/GenericDropdown.tsx";
import React, { useEffect, useState } from "react";
import { createUserApi, getAllRolesApi } from "session/BackendApi.ts";
import { CreateUserDao, RoleDao } from "session/dao/Dao.ts";
import Swal from 'sweetalert2';

import './style/UserStyles.css'

export default function AddUserPage() {

    const [roles, setRoles] = useState<RoleDao[]>([]);
    const [user, setUser] = useState<CreateUserDao>({newPassword: "", role: "", username: "", phoneNumberString: "", oldPassword: "", notificationSms: false});
    const regexPass = new RegExp("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}");
    const regexPhoneNumber = new RegExp("^[0-9]{10}$");
    const [repeatPassword, setRepeatPassword] = useState("");


    useEffect(() => {
        readRoles();
    },[])

    function readRoles() {
        getAllRolesApi().then(res => setRoles(res))
    }

    async function createUser(ev) {
        ev.preventDefault();
        try {

            if(!user.username || user.username.length === 0) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul username trebuie completat!'})
                return
            }
    
            if(!regexPass.test(user.newPassword)) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Parola nu respecta constrangerile. Litera mica, litera mare, cifra, caracter special(#?!@$%^&*-_) si dimensiune minim 8 caractere, dimensiune maxima 24 de caractere!'})
                return
            }

            if(user.newPassword !== repeatPassword) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul parola nu este acelasi cel de repeta parola!'})
                return
            }
    
            if(!user.role || user.role.length === 0) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Trebuie selectat un rol!'})
                return
            }

            if(!regexPhoneNumber.test(user.phoneNumberString)) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Numarul de telefon trebuie sa aiba fix 10 cifre!'})
                return
            }
            Swal.fire({title: 'Loading ... ', text: 'Asteptati inrolarea userului.', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

            await createUserApi(user);

            Swal.fire({icon: 'success', title: 'Succes!', text: 'Utilizatorul a fost adaugat cu succes!'})

        } catch (err) {
            Swal.fire({icon: 'error', title: 'Eroare', text: err})
        }
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Create new user account
            </Typography>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                        <Input value={user.username} required size="lg" label="Username" onChange={(e) => {setUser({... user, username: e.target.value})}} />
                        <Input value={user.newPassword} required type="password" size="lg" label="Password" onChange={(e) => {setUser({...user, newPassword: e.target.value})  }}  />
                        <Input value={repeatPassword} required type="password" size="lg" label="Repeat password" onChange={(e) => {setRepeatPassword(e.target.value)}}  />
                        <Input maxLength={10} value={user.phoneNumberString} required size="lg" label="Phone No" onChange={(e) => {setUser({...user, phoneNumberString: e.target.value})  }}  />
                        <Input maxLength={2} value={user.age} required size="lg" label="Age" onChange={(e) => {setUser({...user, age: e.target.value})  }}  />

                        <GenericDropdown array={roles!.map(role => role.name)} defaultValue={"Select role"} onChange={(e) => {setUser({...user, role: e})}} />
                    </div>

                    <div className="mb-4 flex flex-col gap-6"> 
                    <button onClick={createUser} className="buttonAddUser">
                    Add user
                    </button>
                    </div>
            </form>
        </div>
      </CardBody>
    </Card>
  </>
}