import { ArrowLongRightIcon, MinusCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Avatar, Chip, Progress, Button, Tooltip } from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { DeviceTypeDao } from "./dao/DeviceTypeDao.ts";
import { deleteDeviceType, getAllDeviceTypes } from "./api/DeviceTypeApi.ts";
import Swal from 'sweetalert2';



export default function ListDeviceTypePage() {

    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});

    const [entity, setEntity] = useState<PageableTemplate<DeviceTypeDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    
    const [modifyState, setModifyState] = useState(false);

    async function deleteEntity(entity: any) {
      try {
        Swal.fire({
          title: 'Sigur vrei sa stergi tipul de dispozitiv \'' + entity.deviceTypeName + '\' ?',
          showDenyButton: true,
          confirmButtonText: 'Sunt sigur!',
          denyButtonText: `Nu!`,
        }).then(async (result) => {
          if (result.isConfirmed) {   
            try {            
              await deleteDeviceType(entity)
              Swal.fire({icon: 'success', title: 'Succes!', text: 'Tip de dispozitiv sters cu succes!'});
              reloadState();
            } catch (err) {
              Swal.fire({icon: 'error', title: 'Eroare', text: err})
            }
          } else if (result.isDenied) {
            Swal.fire('Tipul de dispozitiv nu a fost sters', '', 'info')
          }
        })
      } catch (err) {
        Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
    }

    function onPageChange(newPage: number) {
        setPagination(pagination => ({...pagination, pageIndex: newPage}));
    }

    useEffect(() => {
      readUsers();
    },[modifyState, pagination])

    function reloadState() {
      setModifyState(!modifyState);
    }

    function readUsers() {

      var params = new Map();
      params.set("pageIndex", pagination.pageIndex);
      params.set("pageSize", pagination.pageSize);

      getAllDeviceTypes(params).then(res => setEntity(res))
    }

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>

          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Tip Dispozitiv
            </Typography>
            
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            
          <Link to="/dashboard/add-device-type">
            {/* <Button className="mb-8 ml-5">
                <Typography className="text-xs font-semibold">Adaugare Tip Device</Typography>
            </Button> */}
            <Button variant="text" className="inline-flex items-center gap-2" color="blue">
            Adaugare Tip Dispozitiv <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
            </Button>
          </Link>
          
           
        
          <Pagination _page={pagination} totalCount={entity?.totalElements} onPageChanged={onPageChange}/>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tip", "Detalii", ""].map((el) => (
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
                {entity?.content?.map(
                  (item, key) => {
                    const className = `py-3 px-5 ${
                      key === entity.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <>
                      <tr key={item.id}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.deviceTypeName}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.deviceTypeDetails}
                          </Typography>
                        </td>

                        <td className={className}>
                          <Link to={`/dashboard/modify-device-type/${item.id}`}>
                            <Tooltip content="Editare">



                              <Button className="flex items-center gap-3">
                                <PencilSquareIcon strokeWidth={2} className="h-5 w-5" />
                              </Button>

                              {/* <button className="btn">
                                <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" className="icon">
                                <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                              </svg>
                              </button> */}



                            </Tooltip>
                          </Link>
                        </td>


                        <td className={className}>
                          <Tooltip content="Sterge">



                            <Button className="flex items-center gap-3" color="red" onClick={() => deleteEntity(item)}>
                              <TrashIcon strokeWidth={2} className="h-5 w-5" />
                            </Button>



                          </Tooltip>
                        </td>



                    


                      </tr>
                      
                        
                        </>

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