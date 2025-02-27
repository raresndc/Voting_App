import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tooltip,
  Button,
  
  
} from "@material-tailwind/react";
import axios from "axios";
import { Collapse } from 'react-collapse';


import { Link } from "react-router-dom";
import React, {useEffect, useState } from "react";
import { BellAlertIcon, CpuChipIcon, ServerIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import GlobalState from "session/GlobalState.ts";
import { ArrowLongRightIcon, MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "../routers/dao/RouterDao.ts";

import { deleteRouter, getAllRouters } from "../routers/api/RouterApi.ts";  
import Swal from "sweetalert2";
import './style/HomeStyle.css';


export default function HomePage() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(cur => !cur);

  const [collapseOpen, setCollapseOpen] = useState(false);
  
  const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  const [swalFired, setSwalFired] = useState(false);

  const toggleCollapse = () => {
    setModifyState(!modifyState);
    setCollapseOpen(!collapseOpen);
  };

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
        text: `Unul sau mai multe routere sunt un-reachable. ` + `Va rugam verificati sectiunea routere din aplicatie" `,
        icon: "warning",
        confirmButtonText: "OK",
        allowEscapeKey: false, 
        allowOutsideClick: false
      });
      setSwalFired(true);
    }
  };

  const getStatusColor2 = (router) => {
    if (!swalFired && router.status === "Unreachable") {
      Swal.fire({
        title: "Atentie router un-reachable",
        text: `Unul sau mai multe routere sunt un-reachable. ` + `Va rugam contactati Sistem-Admin" `,
        icon: "warning",
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
    <>
      <div className="relative mt-8 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover	bg-center" color="indigo">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
{
(GlobalState.role !== ACCOUNT_TYPES.GUEST && GlobalState.role !== ACCOUNT_TYPES.USER && GlobalState.role !== ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI) ? 
<>
      {entity?.content?.map(
                  (router, key) => {
                    getStatusColor(router);
                    const className = `py-3 px-5 ${
                      key === entity.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`; })}
</> : ""
}

{
(GlobalState.role !== ACCOUNT_TYPES.SUPER_USER && GlobalState.role !== ACCOUNT_TYPES.SUPER_USER ) ? 
<>
      {entity?.content?.map(
                  (router, key) => {
                    getStatusColor2(router);
                    const className = `py-3 px-5 ${
                      key === entity.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50 "
                    }`; })}
</> : ""
}

      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 ">
        <CardBody className="p-4 " >
          <div className="px-4 pb-4 ">
            <Typography variant="h6" color="blue-gray" className="mb-2 ">
              VotingApp
            </Typography>

            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4 ">
              {projectsData.map(
                ({ img, title, route, privileges}) => (
                  
                  <Card key={title} color="transparent" shadow={false}>
                    {
                      (privileges?.indexOf(GlobalState.role) > -1) ? 
                      <>
                    <CardHeader floated={false} color="indigo" className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                      {img}
                    </CardHeader>

                   
                    <CardBody className="py-0 px-1 text-center">
                      <Typography variant="h5" color="blue-gray-900" className="mt-1 mb-2"> {title} </Typography>
                    </CardBody>

                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1 m-auto">
                      <Link to={route}>
                        {/* <Button size="sm" 
                        className="bg-gradient-to-r from-indigo-300 to-indigo-950 bg-cover">
                          Vizualizeaza
                        </Button> */}

                        <button className="buttonH">
                        <span className="text">View</span>
                        </button>



                      </Link>
                    </CardFooter>
                    </> : ""
                    }
                  </Card>
                )
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
  }






  export const projectsData = [
    {
      img: <CpuChipIcon className="h-full w-full object-cover"/>,
      title: "Dispozitive",
      route: "/dashboard/devices",
      privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER, ACCOUNT_TYPES.USER]
    },
    {
      img: <ServerIcon className="h-full w-full object-cover"/>,
      title: "Routere",
      route: "/dashboard/router",
      privileges: [ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER]
    },
    {
      img: <BellAlertIcon className="h-full w-full object-cover"/>,
      title: "Notificari",
      route: "/dashboard/notification",
      privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER, ACCOUNT_TYPES.USER]
    },
    {
      img: <UserCircleIcon className="h-full w-full object-cover"/>,
      title: "Profil",
      route: "/dashboard/profile",
      privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER, ACCOUNT_TYPES.USER]
    },
  ];