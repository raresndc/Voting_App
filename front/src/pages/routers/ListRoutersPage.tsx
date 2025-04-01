import {
  ArrowLongRightIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Avatar,
  Chip,
  Progress,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "./dao/RouterDao.ts";
import Swal from "sweetalert2";
import { deleteRouter, getAllRouters } from "./api/RouterApi.ts";
import axios from "axios";
import { Collapse } from "react-collapse";
import { HardDrive, HelpCircleIcon, PencilIcon, RouterIcon, ServerIcon, ShieldCheckIcon, SquarePen, Trash2 } from "lucide-react";

export default function ListRoutersPage() {
  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  const [swalFired, setSwalFired] = useState(false);

  async function deleteEntity(entity: any) {
    try {
      Swal.fire({
        title:
          "You definitely want to delete the router? '" +
          entity.routerName +
          "' ?",
        showDenyButton: true,
        confirmButtonText: "I am sure!",
        denyButtonText: `No!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRouter(entity);
            Swal.fire({
              icon: "success",
              title: "Succes!",
              text: "Router deleted successfully!",
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            reloadState();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Eroare",
              text: err,
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
          }
        } else if (result.isDenied) {
          Swal.fire("The router was not deleted!", "", "info");
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  function onPageChange(newPage: number) {
    setPagination((pagination) => ({ ...pagination, pageIndex: newPage }));
  }

  useEffect(() => {
    readDao();
  }, [modifyState, pagination]);

  function reloadState() {
    setModifyState(!modifyState);
  }

  function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllRouters(params).then((res) => setEntity(res));
  }

  const getStatusColor = (router) => {
    if (!swalFired && router.status === "Unreachable") {
      Swal.fire({
        title: "Attention unreachable router",
        text:
          `One or more routers are unreachable. ` +
          `Please check the application -> Contact "System Admin" `,
        icon: "error",
        confirmButtonText: "OK",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      setSwalFired(true);
    }
  };

  useEffect(() => {
    setSwalFired(false);
  }, []);


  const renderIcon = (deviceType) => {
    switch (deviceType) {
      case "router":
        return (
          <Tooltip content="Router">
            <RouterIcon strokeWidth={2} className="h-5 w-5" />
          </Tooltip>
        );
      case "switch":
        return (
          <Tooltip content="Switch">
            <HardDrive strokeWidth={2} className="h-5 w-5" />
          </Tooltip>
        );
      case "server":
        return (
          <Tooltip content="Server">
            <ServerIcon strokeWidth={2} className="h-5 w-5" />
          </Tooltip>
        );
      case "firewall":
        return (
          <Tooltip content="Firewall">
            <ShieldCheckIcon strokeWidth={2} className="h-5 w-5" />
          
          </Tooltip>
        );
      default:
        return (
          <Tooltip content="Unknown Device">
            <HelpCircleIcon strokeWidth={2} className="h-5 w-5" />
          </Tooltip>
        );
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="indigo"
          className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="white">
            Network Dashboard
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <Link to="/dashboard/add-router">
            {/* <Button className="mb-8 ml-5">
                <Typography className="text-xs font-semibold">Inrolare router</Typography>
            </Button> */}
            <Button
              variant="text"
              className="inline-flex items-center gap-2"
              color="gray"
            >
              Add network device{" "}
              <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
            </Button>
          </Link>

          <Pagination
            _page={pagination}
            totalCount={entity?.totalElements}
            onPageChanged={onPageChange}
          />
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="whitespace-nowrap">
                {[
                  "",
                  "Name",
                  "DETAILS",
                  // "SINTAX",
                  "Ip",
                  "Username",
                  "Password",
                  "COMMUNICATION TYPE",
                  "PHONE NO",
                  "Status",
                  "",
                ].map((el) => (
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
              {entity?.content?.map((router, key) => {
                // getStatusColor(router);
                const className = `py-3 px-5 ${
                  key === entity.content.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={router.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap">
                      {renderIcon(router.tipRouter)}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap"

                      >
                        {router.routerName}
                      </Typography>
                    </td>
                    <td className={className}>
                    <Tooltip content={router.routerDetails}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap w-[400px]"
                        style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        position: 'relative',
                      }}
                      >
                        {router.routerDetails}
                      </Typography>
                      </Tooltip>
                    </td>
                    {/* <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap">
                        {router.routerSyntax}
                      </Typography>
                    </td> */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap">
                        {router.routerIp}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap">
                        {router.routerUsername}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap">
                        {router.routerPassword}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={
                          router.communicationDeviceRouter
                            ? "cyan"
                            : "blue-gray"
                        }
                        value={
                          router.communicationDeviceRouter
                            ? "Network"
                            : "Notifications"
                        }
                        className="py-0.5 px-2 text-[11px] font-medium"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {router.tipRouter === "router" && router.routerPhone
                          ? router.routerPhone.slice(3)
                          : ""}
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
                        value={router.status === "Reachable" ? "Up" : "Down"}
                        // className="py-0.5 px-2 text-[11px] font-medium"
                        className={`py-0.5 px-2 text-[11px] font-medium ${
                          router.status !== "Reachable" ? "animate-blink" : ""
                        }`}
                      />
                      {/* </div> */}
                    </td>

                    <td className="py-3 px-5 border-b border-blue-gray-50 whitespace-nowrap">
                        <Link to={`/dashboard/modify-router/${router.id}`}>
                          <Tooltip content="Edit">
                            <button className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                              <SquarePen
                                strokeWidth={2}
                                className="h-5 w-5"
                              />
                            </button>
                          </Tooltip>
                        </Link>
                        <Tooltip content="Delete">
                          <button
                            onClick={() => deleteEntity(router)}
                            className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                          >
                            <Trash2 strokeWidth={2} className="h-5 w-5" />
                          </button>
                        </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
