import {
  ArrowLongRightIcon,
  CommandLineIcon,
  InformationCircleIcon,
  LightBulbIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  PowerIcon,
  ServerIcon,
  ServerStackIcon,
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
import { PaginationModel } from "components/PaginationModel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DeviceDao, DevicePasswordDao } from "./dao/DeviceDao";
import { PageableTemplate } from "session/dao/PageableDao";
import Swal from "sweetalert2";
import {
  deleteDevice,
  getAllDevices,
  factoryResetDevice,
  addRouterMasterApi,
  addRouterUserApi,
  deleteRouterUserApi,
} from "./api/DeviceApi.ts";
import GlobalState from "session/GlobalState.ts";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import { Info, SquarePen, Trash2 } from "lucide-react";

export default function ListDevicesPage() {
  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [entity, setEntity] = useState<PageableTemplate<DeviceDao>>();

  const [modifyState, setModifyState] = useState(false);

  useEffect(() => {
    readDao();
  }, [modifyState, pagination]);

  function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllDevices(params).then((res) => setEntity(res));
  }

  async function deleteEntity(entity: any) {
    try {
      Swal.fire({
        title:
          "You definitely want to delete the doctor '" +
          entity.deviceName +
          "' ?",
        showDenyButton: true,
        confirmButtonText: "I am sure!",
        denyButtonText: `No!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteDevice(entity);
            reloadState();
            Swal.fire({
              icon: "success",
              title: "Succes!",
              text: "Device deleted successfully!",
            });
            reloadState();
          } catch (err) {
            Swal.fire({ icon: "error", title: "Eroare", text: err });
          }
        } else if (result.isDenied) {
          Swal.fire("This doctor has not been erased", "", "info");
        }
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Eroare", text: err });
    }
  }

  async function factoryReset(entity: any) {
    try {
      Swal.fire({
        title: "Factory reset",
        html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
        showDenyButton: true,
        confirmButtonText: "Reset",
        denyButtonText: `Anulare`,
        focusConfirm: false,
        preConfirm: () => {
          const password = Swal.getPopup().querySelector("#password");
          if (!password) {
            Swal.showValidationMessage(`Introduceti parola!`);
          }
          return { password: password };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            var resetDevice: DevicePasswordDao = {
              device: entity,
              password: result.value.password.value,
              oldPassword: null,
            };
            await factoryResetDevice(resetDevice);
            Swal.fire({
              icon: "success",
              title: "Succes!",
              text: "Comanda transmisa cu succes!",
            });
            reloadState();
          } catch (err) {
            Swal.fire({ icon: "error", title: "Eroare", text: err });
          }
        } else if (result.isDenied) {
          Swal.fire("Comanda a fost anulata!", "", "info");
        }
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Eroare", text: err });
    }
  }

  async function addRouterMaster(entity: any) {
    try {
      await addRouterMasterApi(entity);
      reloadState();
      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Router master schimbat cu succes!",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Eroare", text: err });
    }
  }

  async function addRouterUser(entity: any) {
    try {
      await addRouterUserApi(entity);
      reloadState();
      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Router user schimbat cu succes!",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Eroare", text: err });
    }
  }

  async function deleteRouterUser(entity: any) {
    try {
      await deleteRouterUserApi(entity);
      reloadState();
      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Router user sters cu succes!",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Eroare", text: err });
    }
  }

  function reloadState() {
    setModifyState(!modifyState);
  }

  function onPageChange(newPage: number) {
    setPagination((pagination) => ({ ...pagination, pageIndex: newPage }));
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="indigo"
          className="mb-8 p-6 flex justify-between items-center bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="gray">
            Candidats
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <Link to="/dashboard/add-doctor">
            {GlobalState.role !== ACCOUNT_TYPES.ROLE_CANDIDATE &&
            GlobalState.role !== ACCOUNT_TYPES.ROLE_USER ? (
              <>
                <Button
                  variant="text"
                  className="inline-flex items-center gap-2"
                  color="gray"
                >
                  Add candidat{" "}
                  <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
                </Button>
              </>
            ) : (
              ""
            )}
          </Link>

          <Pagination
            _page={pagination}
            totalCount={entity?.totalElements}
            onPageChanged={onPageChange}
          />

          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Political Party", "", "", "", ""].map((el) => (
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
              {entity?.content.map((device, key) => {
                const className = `py-3 px-5 whitespace-nowrap ${
                  key === entity.content.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                return (
                  <tr key={device.deviceName}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {device.deviceName}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {device?.elDeviceType?.deviceTypeName} -{" "}
                        {device?.elDeviceType?.deviceTypeDetails}
                      </Typography>
                    </td>

                    {/* <td className={className}>
                      <Link to={`/dashboard/configure-device/${device.id}`}>
                        <Tooltip content="Info">
                          <Button className="flex items-center gap-3 bg-indigo-300">
                            <InformationCircleIcon
                              color="white"
                              strokeWidth={2}
                              className="h-5 w-5"
                            />
                          </Button>
                        </Tooltip>
                      </Link>
                    </td>
                    <td className={className}>
                      <Link to={`/dashboard/modify-doctor/${device.id}`}>
                        {GlobalState.role !== ACCOUNT_TYPES.GUEST &&
                        GlobalState.role !== ACCOUNT_TYPES.USER ? (
                          <>
                            <Tooltip content="Edit">
                              <Button
                                className="flex items-center gap-3"
                                color="gray"
                              >
                                <PencilSquareIcon
                                  color="white"
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />
                              </Button>
                            </Tooltip>
                          </>
                        ) : (
                          ""
                        )}
                      </Link>
                    </td>
                    <td className={className}>
                      {GlobalState.role !== ACCOUNT_TYPES.GUEST &&
                      GlobalState.role !== ACCOUNT_TYPES.USER ? (
                        <>
                          <Tooltip content="Delete">
                            <Button
                              className="flex items-center gap-3 bg-red-900"
                              onClick={() => deleteEntity(device)}
                            >
                              <TrashIcon strokeWidth={2} className="h-5 w-5" />
                            </Button>
                          </Tooltip>{" "}
                        </>
                      ) : (
                        ""
                      )}
                    </td> */}

                    <td className={className}>
                      <Link to={`/dashboard/configure-device/${device.id}`}>
                        <Tooltip content="Info">
                          <button className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                            <Info strokeWidth={2} className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </Link>

                      {GlobalState.role !== ACCOUNT_TYPES.ROLE_SUPER_ADMIN &&
                      GlobalState.role !== ACCOUNT_TYPES.ROLE_USER ? (
                        <>
                          <Link to={`/dashboard/modify-doctor/${device.id}`}>
                            <Tooltip content="Edit">
                              <button className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                                <SquarePen
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />
                              </button>
                            </Tooltip>
                          </Link>
                        </>
                      ) : (
                        ""
                      )}

                      {GlobalState.role !== ACCOUNT_TYPES.ROLE_CANDIDATE &&
                      GlobalState.role !== ACCOUNT_TYPES.ROLE_USER ? (
                        <>
                          <Tooltip content="Delete">
                            <button
                              onClick={() => deleteEntity(device)}
                              className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                            >
                              <Trash2 strokeWidth={2} className="h-5 w-5" />
                            </button>
                          </Tooltip>
                        </>
                      ) : (
                        ""
                      )}
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
