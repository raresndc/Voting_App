import { Card, CardHeader, Typography, CardBody, Input, Button, Checkbox } from "@material-tailwind/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { changePasswordByAdminApi, changePhoneNumberByAdminApi, changePhoneNumberByUserApi } from "session/BackendApi.ts";
import GlobalState from "session/GlobalState.ts";
import { CreateUserDao } from "session/dao/Dao.ts";
import Swal from 'sweetalert2';

export default function ModifyUserPage() {

    const params = useParams();

    const [user, setUser] = useState<CreateUserDao>({newPassword: "", role: "", username: params.username, phoneNumberString: "", oldPassword: "", notificationSms: false});
    const [repeatPassword, setRepeatPassword] = useState("");

    const regexPass = new RegExp("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}");
    const regexPhoneNumber = new RegExp("^[0-9]{10}$");

    async function modifyPassword(ev) {
        ev.preventDefault();
        try {

            if(!regexPass.test(user.newPassword)) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Parola nu respecta constrangerile. Litera mica, litera mare, cifra, caracter special(#?!@$%^&*-_) si dimensiune minim 8 caractere, dimensiune maxima 24 de caractere!'})
                return
            }

            if(user.newPassword !== repeatPassword) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Campul parola nu este acelasi cel de repeta parola!'})
                return
            }

            await changePasswordByAdminApi(user);
        
            Swal.fire({icon: 'success', title: 'Succes!', text: 'Utilizatorul a fost modificat cu succes!'})

        } catch (err) {
            Swal.fire({icon: 'error', title: 'Eroare', text: err})
        }
        
    }

    async function modifyPhoneNumber(ev) {
        ev.preventDefault();
        try {

            if(!regexPhoneNumber.test(user.phoneNumberString)) {
                Swal.fire({icon: 'error', title: 'Eroare', text: 'Numarul de telefon trebuie sa aiba fix 10 cifre!'})
                return
            }

            await changePhoneNumberByAdminApi(user);

            Swal.fire({icon: 'success', title: 'Succes!', text: 'Utilizatorul a fost modificat cu succes!'})

        } catch (err) {
            Swal.fire({icon: 'error', title: 'Eroare', text: err})
        }
    }

    return  <>
    <Card className="mx-3 mt-10 mb-6 lg:mx-4">

    <CardHeader variant="gradient" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" color="white">
              Modifica parola utilizator
            </Typography>
            <div>
                <Typography variant="h6" color = "lime" className="mb-1">{user.username}</Typography>
            </div>  

        </div>
    </CardHeader>

      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">

        </div>
        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
                    <div className="mb-4 flex flex-col gap-6"> 
                  
                        
                        <Input value={user.newPassword} required type="password" size="lg" label="Parola" onChange={(e) => {setUser({...user, newPassword: e.target.value})  }}  />
                        <Input value={repeatPassword} required type="password" size="lg" label="Repeta Parola" onChange={(e) => {setRepeatPassword(e.target.value)}}  />
                    </div>
                    {/* <Button onClick={modifyPassword} className="mt-6 bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover" fullWidth>Modifica parola</Button> */}

                    <div className="mb-4 flex flex-col gap-6"> 
                    <button onClick={modifyPassword} className="buttonAddUser">
                    Modifica parola
                    </button>
                    </div>

                    <div className="mb-4 mt-10 flex flex-col gap-6"> 
                        <Input value={user?.phoneNumberString} required size="lg" label="Numar telefon" onChange={(e) => {setUser({...user, phoneNumberString: e.target.value})  }}  />
                    </div>

                    {/* <Button onClick={modifyPhoneNumber} className="mt-6 bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover" fullWidth>Modifica numar de telefon</Button> */}

                    <div className="mb-4 flex flex-col gap-6"> 
                    <button onClick={modifyPhoneNumber} className="buttonAddUser">
                    Modifica numar de telefon
                    </button>
                    </div>

            </form>
        </div>
      </CardBody>
    </Card>
  </>
}