import { MinusCircleIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Chip, Button, Tooltip } from "@material-tailwind/react";
import GenericDropdownAutocomplete from "components/GenericDropdownAutocomplete.tsx";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.tsx";
import { getAllDevices } from "pages/devices/api/DeviceApi.ts";
import { DeviceDao } from "pages/devices/dao/DeviceDao.ts";
import React, { useEffect, useState } from "react";
import { getAllUsersPaginatedApi } from "session/BackendApi.ts";
import { UserDao } from "session/dao/Dao.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { AddDeviceUserDao, DeleteDeviceUserDao } from "./dao/DeviceUserDao.ts";
import { deleteDeviceUserApi, saveDeviceUserApi } from "./api/DeviceUserApi.ts";
import Swal from 'sweetalert2';

import './style/AdminStyles.css'

export default function ListDevicesToUsers() {

    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 9999});
    const [paginationDropDown, setPaginationDropDown] = useState<PaginationModel>({pageIndex: 0, pageSize: 100000});

    const [devices, setDevices] = useState<PageableTemplate<DeviceDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    const [devicesDropDown, setDevicesDropDown] = useState<PageableTemplate<DeviceDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});

    
    const [users, setUsers] = useState<PageableTemplate<UserDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    const [usersDropDown, setUsersDropDown] = useState<PageableTemplate<UserDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});

    
    const [modifyState, setModifyState] = useState(false);

    // var selectedUserName = "";
    // var selectedDeviceName = "";


    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [selectedDeviceName, setSelectedDeviceName] = useState<string>("");


    useEffect(() => {
      var params = new Map();
      params.set("pageIndex", paginationDropDown.pageIndex);
      params.set("pageSize", paginationDropDown.pageSize);
      getAllDevices(params).then(res => setDevicesDropDown(res));
      getAllUsersPaginatedApi(params).then(res => setUsers(res));
    },[])

    useEffect(() => {
      var params = new Map();
      params.set("pageIndex", pagination.pageIndex);
      params.set("pageSize", pagination.pageSize);
      getAllDevices(params).then(res => setDevices(res));
    },[modifyState, pagination])

    function reloadState() {
      setModifyState(!modifyState);
    }

    function onPageChange(newPage: number) {
      setPagination(pagination => ({...pagination, pageIndex: newPage}));
     }
  
    async function deleteUserDevice(dispozitiv:DeviceDao, utilizator:UserDao) {
      try {
        Swal.fire({
          title: 'Sigur vrei sa dezaloci dispozitivul \'' + dispozitiv.deviceName + '\' de la utilizatorul  \'' + utilizator.username + '\' ?',
          showDenyButton: true,
          confirmButtonText: 'Sunt sigur!',
          denyButtonText: `Nu!`,
        }).then(async (result) => {
          if (result.isConfirmed) {   
            try {
              var selectedUserDevice: DeleteDeviceUserDao = {device: dispozitiv, username: utilizator.username};            
              await deleteDeviceUserApi(selectedUserDevice);
              reloadState();
              Swal.fire({icon: 'success', title: 'Succes!', text: 'Dezalocare realizata cu succes!'});
              reloadState();
            } catch (err) {
              Swal.fire({icon: 'error', title: 'Eroare', text: err})
            }
          } else if (result.isDenied) {
            Swal.fire('Dezalocarea nu a putut fi efectuata', '', 'info')
          }
        })
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    function selectAssignedDevices() {

      var assignedDevices = [];

      for (let device of devices?.content) {
        if(device.users?.length > 0) {
          for (let user of device.users) {
            assignedDevices.push({dispozitiv: device, utilizator: user});
        }
      }
    }

    return assignedDevices;

  }

    function getUsersNames() {

      var usersNames = new Array();
      for (let user of users?.content!) {
        usersNames.push(user.username);
      }

      return usersNames;
    }

    function getDevicesNames() {

      var devicesNames = new Array();
      for (let device of devicesDropDown?.content!) {
        devicesNames.push(device.deviceName);
      }

      return devicesNames;
    }

    function selectDevice() {

      for (let device of devices?.content) {
        if(selectedDeviceName === device.deviceName) {
            return device;
        }
      }

      return null;
    }


    async function createUserDevice(ev) {
      ev.preventDefault();
      try {
        

      // var selectedUserDevice: AddDeviceUserDao = {username: selectedUserName, elDevice: selectDevice()};

        var selectedUserDevice: AddDeviceUserDao = {
          username: selectedUserName,
          elDevice: selectDevice(),
        };

      saveDeviceUserApi(selectedUserDevice);
      reloadState();
      
      Swal.fire({icon: 'success', title: 'Succes!', text: 'Permisiunea de a accesa dispozitivul a fost setata cu succes!'})
    
      if(selectedUserName === "" || selectedDeviceName === ""){
        Swal.fire({icon: 'warning', title: 'Atentie!', text: 'Unul sau mai multe campuri sunt goale. Va rugam selectati ambele campuri'})
      }

      } catch (err) {
          Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Asignare dispozitive la utilizator
            </Typography>

          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            

          <div className="flex w-max gap-4 mt-1 ml-5">
            <GenericDropdownAutocomplete array={getUsersNames()} defaultValue={"Selecteaza utilizator"} onChange={(e) => setSelectedUserName(e)} />
            <GenericDropdownAutocomplete array={getDevicesNames()} defaultValue={"Selecteaza device"} onChange={(e) => setSelectedDeviceName(e)} />
            <div>


            {/* <Button onClick={createUserDevice} className="bg-gradient-to-r from-indigo-300 to-blue-500 bg-cover inline-flex items-center gap-2 " variant="gradient">
                 <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Asignare
            </Button> */}

            
                    {/* <button onClick={createUserDevice} className="buttonAddUser">
                   <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Asignare
                    </button> */}

                    <button onClick={createUserDevice} className="buttonAdmin">
                      <div className="flex items-center">
                        <UserPlusIcon strokeWidth={2} className="h-5 w-5 mr-2" />
                        <span>Asignare</span>
                      </div>
                    </button>
                    



            </div>
          </div>
          <br>
          
          </br>
              
          {/* <Pagination _page={pagination} totalCount={selectAssignedDevices().length} onPageChanged={onPageChange}/> */}
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Dispozitiv", "Utilizator", ""].map((el) => (
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
                {selectAssignedDevices()?.map(
                  (element, key) => {
                    const className = `py-3 px-5 ${
                      key === selectAssignedDevices().length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={element.id}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {element.dispozitiv.deviceName}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {element.utilizator.username}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Tooltip content="Sterge">
                                <Button className="flex items-center gap-3" color="red" onClick={() => deleteUserDevice(element.dispozitiv, element.utilizator)}>
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