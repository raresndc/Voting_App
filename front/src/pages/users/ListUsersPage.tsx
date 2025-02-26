import { ArrowLongRightIcon, LockOpenIcon, MinusCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Avatar, Chip, Progress, Button, Tooltip } from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUserApi, getAllUsersPaginatedApi, unlockUserApi } from "session/BackendApi.ts";
import GlobalState from "session/GlobalState";
import { UserDao, CreateUserDao } from "session/dao/Dao.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import Swal from 'sweetalert2';
import axios from 'axios';

import './style/UserStyles.css'

export default function ListUtilizatoriPage() {

    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});

    const [users, setUsers] = useState<PageableTemplate<UserDao>>();
    
    const [modifyState, setModifyState] = useState(false);


    useEffect(() => {
      readUsers();
    },[modifyState, pagination])

    function readUsers() {

      var params = new Map();
      params.set("pageIndex", pagination.pageIndex);
      params.set("pageSize", pagination.pageSize);

      getAllUsersPaginatedApi(params).then(res => setUsers(res));
    }

    function onPageChange(newPage: number) {
      setPagination(pagination => ({...pagination, pageIndex: newPage}));
    }

    function reloadState() {
      setModifyState(!modifyState);
    }

    async function unlockUser(username: any) {
      try {
        let user: CreateUserDao = {username: username};
        await unlockUserApi(user);
        Swal.fire({icon: 'success', title: 'Succes!', text: 'Utilizator deblocat cu succes!',allowEscapeKey: false, allowOutsideClick: false});
        reloadState();
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
      }
    }

    async function deleteUser(username: any) {
      try {
        Swal.fire({
          title: 'Sigur vrei sa stergi utilizatorul \'' + username + '\' ?',
          showDenyButton: true,
          confirmButtonText: 'Sunt sigur!',
          denyButtonText: `Nu!`,
        }).then(async (result) => {
          if (result.isConfirmed) {   
            try {
              let user: CreateUserDao = {username: username};
              await deleteUserApi(user);
              Swal.fire({icon: 'success', title: 'Succes!', text: 'Utilizator sters cu succes!',allowEscapeKey: false, allowOutsideClick: false});
              reloadState();
            } catch (err) {
              Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
            }
          } else if (result.isDenied) {
            Swal.fire('Utilizatorul nu a fost sters', '', 'info')
          }
        })
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }
        
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Utilizatori
            </Typography>

          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            
          <Link to="/dashboard/add-user">
            {/* <Button className="mb-8 ml-5">
                <Typography className="text-xs font-semibold">Creare utilizator</Typography>
            </Button> */}



            <Button variant="text" className="inline-flex items-center gap-2" color="blue">
            Creare utilizator <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
            </Button>

            
          </Link>
          

          <Pagination _page={pagination} totalCount={users?.totalElements} onPageChanged={onPageChange}/>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Username", "Rol", "Blocat", "Autentificare", "Numar telefon",""].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users?.content.map(
                  (user, index) => {
                    const className = `py-3 px-5 ${
                      index === users.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
   
                    return (
                      <tr key={user.username}>
                        <td className={className}>
                          <div className="flex items-center gap-4 ">
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {user.username}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user?.roles[0]?.name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip variant="gradient"
                            color={user.accountNonLocked ? "green" : "blue-gray"}
                            value={user.accountNonLocked ? "neblocat" : "blocat"}
                            className="py-0.5 px-2 text-[11px] font-medium"
                          />
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user?.lastTimeLogged?.replaceAll("T", " ").slice(0,19)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user?.phoneNumberString}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Link to={`/dashboard/modify-user/${user.username}`}>
                            <Tooltip content="Editare">
                                <Button className="flex items-center gap-3">
                                  <PencilSquareIcon strokeWidth={2} className="h-5 w-5" />
                                </Button>
                              </Tooltip>
                          </Link>
                        </td>
                        <td className={className}>
                          <Tooltip content="Deblocheaza">
                            <Button onClick={() => unlockUser(user.username)} color="teal">
                              <LockOpenIcon strokeWidth={2} className="h-5 w-5" />
                            </Button>
                          </Tooltip>
                        </td>
                        <td className={className}>
                          <Tooltip content="Sterge">
                              <Button className="flex items-center gap-3" color="red" onClick={() => deleteUser(user.username)}>
                                <TrashIcon strokeWidth={2} className="h-5 w-5" />
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
           
          </CardBody>
        </Card>
      </div>
    );

  }

