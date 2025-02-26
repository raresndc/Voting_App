import { ArrowLongRightIcon, CommandLineIcon, LightBulbIcon, MinusCircleIcon, PencilSquareIcon, PowerIcon, ServerIcon, ServerStackIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Avatar, Chip, Progress, Button, Tooltip } from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DeviceDao, DevicePasswordDao } from "./dao/DeviceDao";
import { PageableTemplate } from "session/dao/PageableDao";
import Swal from 'sweetalert2';
import { deleteDevice, getAllDevices, factoryResetDevice, addRouterMasterApi, addRouterUserApi, deleteRouterUserApi } from "./api/DeviceApi.ts";
import GlobalState from "session/GlobalState.ts";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";

export default function ListDevicesPage() {

    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 5});

    const [entity, setEntity] = useState<PageableTemplate<DeviceDao>>();
  
    const [modifyState, setModifyState] = useState(false);

   useEffect(() => {
    readDao();
   },[modifyState, pagination])

   function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllDevices(params).then(res => setEntity(res))
  }

   async function deleteEntity(entity: any) {
    try {
      Swal.fire({
        title: 'Sigur vrei sa stergi dispozitivul \'' + entity.deviceName + '\' ?',
        showDenyButton: true,
        confirmButtonText: 'Sunt sigur!',
        denyButtonText: `Nu!`,
      }).then(async (result) => {
        if (result.isConfirmed) {   
          try {         
            await deleteDevice(entity)
            reloadState();
            Swal.fire({icon: 'success', title: 'Succes!', text: 'Dispozitiv sters cu succes!'});
            reloadState();
          } catch (err) {
            Swal.fire({icon: 'error', title: 'Eroare', text: err})
          }
        } else if (result.isDenied) {
          Swal.fire('Dispozitivul nu a fost sters', '', 'info')
        }
      })
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err})
    }
   }

   async function factoryReset(entity: any) {
    try {
      Swal.fire({
        title: 'Factory reset',
        html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
        showDenyButton: true,
        confirmButtonText: 'Reset',
        denyButtonText: `Anulare`,
        focusConfirm: false,
        preConfirm: () => {
          const password = Swal.getPopup().querySelector('#password');
          if (!password) {
            Swal.showValidationMessage(`Introduceti parola!`)
          }
          return {password: password }
        }
      }).then(
        async (result) => {if (result.isConfirmed) {   
            try {
              var resetDevice:DevicePasswordDao = {device: entity, password: result.value.password.value, oldPassword: null};
              await factoryResetDevice(resetDevice);
              Swal.fire({icon: 'success', title: 'Succes!', text: 'Comanda transmisa cu succes!'});
              reloadState();
            } catch (err) {
              Swal.fire({icon: 'error', title: 'Eroare', text: err})
            }
          } else if (result.isDenied) {
            Swal.fire('Comanda a fost anulata!', '', 'info')
          }
        }
        )
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err})
    }
   }

   async function addRouterMaster(entity: any) {
    try {
      await addRouterMasterApi(entity)
      reloadState();
      Swal.fire({icon: 'success', title: 'Succes!', text: 'Router master schimbat cu succes!'});
    } catch(err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err})
    }
   }

   async function addRouterUser(entity: any) {
    try {
      await addRouterUserApi(entity)
      reloadState();
      Swal.fire({icon: 'success', title: 'Succes!', text: 'Router user schimbat cu succes!'});
      
    } catch(err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err})
    }
   }

   async function deleteRouterUser(entity: any) {
    try {
      await deleteRouterUserApi(entity)
      reloadState();
      Swal.fire({icon: 'success', title: 'Succes!', text: 'Router user sters cu succes!'});
    } catch(err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err})
    }
   }
   
   function reloadState() {
     setModifyState(!modifyState);
   }

   function onPageChange(newPage: number) {
    setPagination(pagination => ({...pagination, pageIndex: newPage}));
   }
   

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>

        <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 flex justify-between items-center bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
          <Typography variant="h6" color="white">
            Dispozitive
          </Typography>

          {/* <Link to="/dashboard/add-device">
            {(GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) && (
              <Button className="ml-5" color = "indigo">
                <Typography className="text-xs font-semibold">Inrolare device</Typography>
              </Button>
            )}
          </Link> */}
        </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            
          {/* <Link to="/dashboard/add-device">
            {
              (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
            <>
               <Button className="mb-8 ml-5" color = "indigo" variant="gradient" >
                <Typography className="text-xs font-semibold">Inrolare device </Typography>
            </Button></> : ""
              
            }
          </Link> */}

          <Link to="/dashboard/add-device">
            {
              (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
            <>
              <Button variant="text" className="inline-flex items-center gap-2" color="blue">
                Inrolare dispozitiv <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
              </Button></> : ""
              
            }
          </Link>


          <Pagination _page={pagination} totalCount={entity?.totalElements} onPageChanged={onPageChange}/>
          
            <table className="w-full min-w-[640px] table-auto">
              
              <thead>
                <tr>
                  {["Nume", "Locatie", "Telefon", "Detalii", "Tip", "", "", "", ""].map((el) => (
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
                {entity?.content.map(
                  (device, key) => {
                    const className = `py-3 px-5 ${
                      key === entity.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                  

                    return (
                      <tr key={device.deviceName}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {device.deviceName}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {device.deviceLocation}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {device.devicePhone.slice(1,device.devicePhone.length)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {device.deviceDetails}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {device?.elDeviceType?.deviceTypeName}
                          </Typography>
                        </td>

                        <td className={className}>
                          <Link to={`/dashboard/configure-device/${device.id}`}>
                            <Tooltip content="Comenzi">
                                <Button className = "flex items-center gap-3" color = "indigo">
                                  <CommandLineIcon color="white" strokeWidth={2} className="h-5 w-5" />
                                </Button>
                              </Tooltip>
                          </Link>
                        </td>
                        <td className={className}>
                          <Link to={`/dashboard/modify-device/${device.id}`}>
                          {
                          (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
                             <>
                            <Tooltip content="Editare">
                                <Button className="flex items-center gap-3" color = "indigo">
                                  <PencilSquareIcon color="white" strokeWidth={2} className="h-5 w-5" />
                                </Button>
                              </Tooltip></> : "" }
                          </Link>
                        </td>                        
                        <td className={className}>
                        {
                          (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
                             <>
                          <Tooltip content="Adauga router master">
                                <Button className="flex items-center gap-3"  onClick={() => addRouterMaster(device)}>
                                  <ServerIcon color="white" strokeWidth={2} className="h-5 w-5" />
                              </Button>
                          </Tooltip> </> : ""
                        }
                        </td>
                        <td className={className}>
                        {
                          (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
                             <>
                          <Tooltip content="Adauga router user">
                                <Button className="flex items-center gap-3" onClick={() => addRouterUser(device)}>
                                  <ServerStackIcon color="white" strokeWidth={2} className="h-5 w-5" />
                              </Button>
                          </Tooltip> </> : ""
                        }
                        </td>
                        <td className={className}>
                        {
                          (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
                             <>
                          <Tooltip content="Sterge router user">
                                <Button className="flex items-center gap-3" color="deep-orange" onClick={() => deleteRouterUser(device)}>
                                  <ServerStackIcon strokeWidth={2} className="h-5 w-5" />
                              </Button>
                          </Tooltip> </> : ""
                        }
                        </td>
                        <td className={className}>
                        {
                          (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
                             <>
                          <Tooltip content="Factory reset">
                                <Button className="flex items-center gap-3" color="red" onClick={() => factoryReset(device)}>
                                  <PowerIcon color="black" strokeWidth={2} className="h-5 w-5" />
                                </Button>
                          </Tooltip> </> : ""
                        }
                        </td>            
                        <td className={className}>
                        {
                          (GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER) ? 
                             <>
                          <Tooltip content="Sterge">
                                <Button className="flex items-center gap-3" color="red" onClick={() => deleteEntity(device)}>
                                  <TrashIcon strokeWidth={2} className="h-5 w-5" />
                              </Button>
                          </Tooltip> </> : "" 
                        }
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