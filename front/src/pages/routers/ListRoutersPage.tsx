import { ArrowLongRightIcon, MinusCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Avatar, Chip, Progress, Button, Tooltip } from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "./dao/RouterDao.ts";
import Swal from 'sweetalert2';
import { deleteRouter, getAllRouters } from "./api/RouterApi.ts";
import axios from "axios";
import { Collapse } from 'react-collapse';


export default function ListRoutersPage() {

  const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  const [swalFired, setSwalFired] = useState(false);

  async function deleteEntity(entity: any) {
    try {
      Swal.fire({
        title: 'Sigur vrei sa stergi routerul \'' + entity.routerName + '\' ?',
        showDenyButton: true,
        confirmButtonText: 'Sunt sigur!',
        denyButtonText: `Nu!`,
      }).then(async (result) => {
        if (result.isConfirmed) {   
          try {            
            await deleteRouter(entity)
            Swal.fire({icon: 'success', title: 'Succes!', text: 'Routerul sters cu succes!', allowEscapeKey: false, allowOutsideClick: false});
            reloadState();
          } catch (err) {
            Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
          }
        } else if (result.isDenied) {
          Swal.fire('Routerul nu a fost sters', '', 'info')
        }
      })
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }
  }

  function onPageChange(newPage: number) {
      setPagination(pagination => ({...pagination, pageIndex: newPage}));
  }

  useEffect(() => {
    readDao();
  },[modifyState, pagination])

  function reloadState() {
    setModifyState(!modifyState);

    
  }

  function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);
    
    getAllRouters(params).then(res => setEntity(res))
  }


  const getStatusColor = (router) => {
    if (!swalFired && router.status === "Unreachable") {
      Swal.fire({
        title: "Atentie router un-reachable",
        text: `Unul sau mai multe routere sunt un-reachable. ` + `Va rugam verificati aplicatia -> Contactati "SistemAdmin" `,
        icon: "error",
        confirmButtonText: "OK",
        allowEscapeKey: false, 
        allowOutsideClick: false
      });
      setSwalFired(true);
    }
  };

  useEffect(() => {
    setSwalFired(false);
  }, []);

    return (
      
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Routere
            </Typography>

          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            
          <Link to="/dashboard/add-router">
            {/* <Button className="mb-8 ml-5">
                <Typography className="text-xs font-semibold">Inrolare router</Typography>
            </Button> */}
            <Button variant="text" className="inline-flex items-center gap-2" color="blue">
            Inrolare router <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
            </Button>
          </Link>
        
          <Pagination _page={pagination} totalCount={entity?.totalElements} onPageChanged={onPageChange}/>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr >
                  {["Nume", "Detalii", "Sintaxa", "Ip", "Username", "Tip Comunicatie", "Numar telefon", "Status", ""].map((el) => (
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
                  (router, key) => {
                    // getStatusColor(router);
                    const className = `py-3 px-5 ${
                      key === entity.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={router.id}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {router.routerName}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {router.routerDetails}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {router.routerSyntax}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {router.routerIp}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {router.routerUsername}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={router.communicationDeviceRouter ? "cyan" : "blue-gray"}
                            value={router.communicationDeviceRouter ? "Device-uri" : "Notificari"}
                            className="py-0.5 px-2 text-[11px] font-medium"
                          />
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {router.routerPhone.slice(3, router.routerPhone.length)}
                          </Typography>
                        </td>
                        
                        <td className={className}>
                        {/* <div
                          className={`py-0.5 px-2 text-[11px] font-medium ${router.status !== "Reachable" ? "animate-blink" : ""}`}
                          onClick={() => getStatusColor(router)}
                        > */}
                          <Chip
                            variant="gradient"
                            color={router.status === "Reachable" ? "green" : "red"}
                            value={router.status === "Reachable" ? "Reachable" : "Unreachable"}
                            // className="py-0.5 px-2 text-[11px] font-medium"
                            className={`py-0.5 px-2 text-[11px] font-medium ${router.status !== "Reachable" ? "animate-blink" : ""}`}
                          />
                          {/* </div> */}
                        </td>

                        <td className={className}>
                          <Link to={`/dashboard/modify-router/${router.id}`}>
                            <Tooltip content="Editare">
                                <Button className="flex items-center gap-3">
                                  <PencilSquareIcon strokeWidth={2} className="h-5 w-5" />
                                </Button>
                              </Tooltip>
                          </Link>
                        </td>
                        <td className={className}>
                          <Tooltip content="Sterge">
                                <Button className="flex items-center gap-3" color="red" onClick={() => deleteEntity(router)}>
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

  