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
import { PaginationModel } from "components/PaginationModel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { DeviceTypeDao } from "./dao/DeviceTypeDao.ts";
import { deleteDeviceType, getAllDeviceTypes } from "./api/DeviceTypeApi.ts";
import Swal from "sweetalert2";
import { SquarePen, Trash2 } from "lucide-react";

export default function ListDeviceTypePage() {
  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [entity, setEntity] = useState<PageableTemplate<DeviceTypeDao>>({
    content: [],
    pageable: null,
    last: false,
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
    sort: null,
    first: false,
    numberOfElements: 0,
    empty: false,
  });

  const iconMap: { [key: string]: string } = {
    PSD: "/PSD.png",
    AUR: "/AUR.png",
    PNL: "/PNL.png",
    USR: "/USR.png",
    POT: "/POT.png",
    SOS: "/SOS.png",
    PMP: "/PMP.png",
    PNCR: "/PNCR.png",
    IND: "/IND.png",
    // Add more mappings
  };

  const [modifyState, setModifyState] = useState(false);

  async function deleteEntity(entity: any) {
    try {
      Swal.fire({
        title:
          "Are you sure you want to delete party '" +
          entity.deviceTypeName +
          "' ?",
        showDenyButton: true,
        confirmButtonText: "I am sure!",
        denyButtonText: `No!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteDeviceType(entity);
            Swal.fire({
              icon: "success",
              title: "Succes!",
              text: "Party successfully deleted!",
            });
            reloadState();
          } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err });
          }
        } else if (result.isDenied) {
          Swal.fire("Party not deleted!", "", "info");
        }
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err });
    }
  }

  function onPageChange(newPage: number) {
    setPagination((pagination) => ({ ...pagination, pageIndex: newPage }));
  }

  useEffect(() => {
    readUsers();
  }, [modifyState, pagination]);

  function reloadState() {
    setModifyState(!modifyState);
  }

  function readUsers() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllDeviceTypes(params).then((res) => setEntity(res));
  }

  const getProgress = (value, total) => (value / total) * 100;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="indigo"
          className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="gray">
            Political Parties
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <Link to="/dashboard/add-device-type">
            <Button
              variant="text"
              className="inline-flex items-center gap-2"
              color="gray"
            >
              Add Political Party{" "}
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
              <tr>
                {[
                  "",
                  "Abbreviation",
                  "Name",
                  "Leader",
                  "Pozition",
                  "Ideology",
                  "Status",
                  "Membrii Senat",
                  "Membrii Cam. Dep.",
                  "Membrii Euro Parl",
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
              {entity?.content?.map((item, key) => {
                const className = `py-3 px-5 ${
                  key === entity.content.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                const statutColor =
                  item.statut === "Opoziție"
                    ? "text-red-600"
                    : item.statut === "Coaliție"
                    ? "text-green-600"
                    : "text-blue-gray-600";
                const pozitieColor =
                  item.pozitie === "Centru-stânga"
                    ? "text-red-600"
                    : item.pozitie === "Centru-dreapta"
                    ? "text-blue-400"
                    : "text-blue-800";

                return (
                  <>
                    <tr key={item.id}>
                      <td className={className}>
                        <img
                          src={iconMap[item.deviceTypeName] || "/default.png"}
                          alt={item.deviceTypeName}
                          className="w-13 h-13 object-cover  border "
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 w-[2vw]">
                          {item.deviceTypeName}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 w-[5vw]">
                          {item.deviceTypeDetails}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 w-[7vw]">
                          {item.lider}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          className={`text-xs font-semibold text-blue-gray-600 w-[2vw] ${pozitieColor}`}
                        >
                          {item.pozitie}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 w-[7vw]">
                          {item.ideologie}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          className={`text-xs font-semibold text-blue-gray-600 w-[1vw] ${statutColor}`}
                        >
                          {item.statut}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="text-xs font-semibold text-blue-gray-600">
                          {item.membriiSenat} / 136
                        </div>
                        <Progress
                          value={getProgress(item.membriiSenat, 136)}
                          className="h-2"
                        />
                      </td>
                      <td className={className}>
                        <div className="text-xs font-semibold text-blue-gray-600">
                          {item.membriiCamDdep} / 330
                        </div>
                        <Progress
                          value={getProgress(item.membriiCamDdep, 330)}
                          className="h-2"
                        />
                      </td>
                      <td className={className}>
                        <div className="text-xs font-semibold text-blue-gray-600">
                          {item.membriiParlaEuro} / 33
                        </div>
                        <Progress
                          value={getProgress(item.membriiParlaEuro, 33)}
                          className="h-2"
                        />
                      </td>

                      <td className="py-3 px-5 border-b border-blue-gray-50 whitespace-nowrap">
                        <Link to={`/dashboard/modify-device-type/${item.id}`}>
                          <Tooltip content="Edit">
                            <button className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                              <SquarePen strokeWidth={2} className="h-5 w-5" />
                            </button>
                          </Tooltip>
                        </Link>
                        <Tooltip content="Delete">
                          <button
                            onClick={() => deleteEntity(item)}
                            className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                          >
                            <Trash2 strokeWidth={2} className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
