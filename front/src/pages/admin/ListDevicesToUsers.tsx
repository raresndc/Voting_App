import {MagnifyingGlassIcon, MinusCircleIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Chip, Button, Tooltip, Input } from "@material-tailwind/react";
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
import GlobalState from "session/GlobalState.ts";

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


    // const [selectedUserName, setSelectedUserName] = useState<string>("");
    const selectedUserName = GlobalState.username;
    const [selectedDeviceName, setSelectedDeviceName] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<UserDao[]>([]);

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
          title: 'You definitely want to cancel \''+ utilizator.username + '\'' + ' medical appointment ' + 'from the doctor \'' + dispozitiv.deviceName + '\' ?',
          showDenyButton: true,
          confirmButtonText: 'I am sure!',
          denyButtonText: `No!`,
        }).then(async (result) => {
          if (result.isConfirmed) {   
            try {
              var selectedUserDevice: DeleteDeviceUserDao = {device: dispozitiv, username: utilizator.username};            
              await deleteDeviceUserApi(selectedUserDevice);
              reloadState();
              Swal.fire({icon: 'success', title: 'Success!', text: 'The appointment was successfully completed!'});
              reloadState();
            } catch (err) {
              Swal.fire({icon: 'error', title: 'Error', text: err})
            }
          } else if (result.isDenied) {
            Swal.fire('The appointment could not be deleted', '', 'info')
          }
        })
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Error', text: err})
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
      
      Swal.fire({icon: 'success', title: 'Success!', text: 'Permission to access the doctor has been successfully set!'})
    
      if(selectedUserName === "" || selectedDeviceName === ""){
        Swal.fire({icon: 'warning', title: 'Attention!', text: 'One or more fields are empty. Please select both fields'})
      }

      } catch (err) {
          Swal.fire({icon: 'error', title: 'Error', text: err})
      }
    }

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    useEffect(() => {
      // Get the current user's username here (replace 'currentUsername' with the actual value)
      const currentUsername = GlobalState.username;
    
      // Set the searchTerm to the current user's username
      setSearchTerm(currentUsername);
      setIsSearchVisible(false); 
    }, []);

    const combinedData = () => {
      // Lowercase the searchTerm for case-insensitive comparison
      const searchTermLower = searchTerm.toLowerCase();
    
      // Filter selectAssignedDevices() based on searchTerm for both device and user names
      const filteredAssignedDevices = selectAssignedDevices()?.filter(device => {
        const deviceNameMatch = device.dispozitiv.deviceName.toLowerCase().includes(searchTermLower);
        const userNameMatch = device.utilizator.username.toLowerCase().includes(searchTermLower);
        return deviceNameMatch || userNameMatch;
      });
    
      // Filter filteredUsers based on searchTerm for user names
      const filteredUsersResult = filteredUsers?.filter(user => {
        return user.username.toLowerCase().includes(searchTermLower);
      });
    
      // Combine the filtered results
      const combined = [...(filteredAssignedDevices || []), ...(filteredUsersResult || [])];
      return combined;
    };
    
    
    

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
            Make an appointment
            </Typography>

          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            

          <div className="flex w-max gap-4 mt-1 ml-5">
            <Input  label="Username" value={GlobalState.username}/>
            <GenericDropdownAutocomplete array={getDevicesNames()} defaultValue={"Select doctor"} onChange={(e) => setSelectedDeviceName(e)} />
            <div>
                    <button onClick={createUserDevice} className="buttonAdmin">
                      <div className="flex items-center">
                        <UserPlusIcon strokeWidth={2} className="h-5 w-5 mr-2" />
                        <span>Assign</span>
                      </div>
                    </button>
            </div>
          </div>
          <br>
          
          </br>
          <div className="flex w-max gap-4 mt-4 ml-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by username..."
                  className={`w-full pr-10 pl-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 ${isSearchVisible ? 'visible' : 'hidden'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                </div>
              </div>
            </div>
              
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Doctor", "User", ""].map((el) => (
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
                  {combinedData().map(
                  (element, key) => {
                    const className = `py-3 px-5 ${
                      key === combinedData().length - 1
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
                          <Tooltip content="Delete">
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