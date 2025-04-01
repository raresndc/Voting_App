import { Bars3Icon, UserCircleIcon, Cog6ToothIcon, BellIcon, ClockIcon, CreditCardIcon, ArrowLeftOnRectangleIcon, BellAlertIcon, CpuChipIcon, ServerIcon, WifiIcon, } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader, CardFooter, Tooltip, Avatar, Breadcrumbs, Button, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Navbar, Typography } from "@material-tailwind/react";
import { setOpenConfigurator, setOpenSidenav, useMaterialTailwindController } from "context/index.tsx";
import { Link, useLocation } from "react-router-dom";
import { logout } from "session/Session.ts";
import axios from "axios";
import { Collapse } from 'react-collapse';


import React, {useEffect, useState } from "react";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import GlobalState from "session/GlobalState.ts";
import { ArrowLongRightIcon, MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "../pages/routers/dao/RouterDao.ts";
import { deleteRouter, getAllRouters } from "../pages/routers/api/RouterApi.ts";  
import StatusRouter from "components/StatusRouter.tsx";

import './style/LayoutStyle.css'

export default function DashboardNavbar() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { fixedNavbar, openSidenav } = controller;
    const { pathname } = useLocation();
    const [layout, page] = pathname.split("/").filter((el) => el !== "");



    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(cur => !cur);
  
    const [collapseOpen, setCollapseOpen] = useState(false);
    
    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
    const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
    const [modifyState, setModifyState] = useState(false);

    const [lastChanged, setLastChanged] = useState(null);
  
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

    const handleStatusChange = () => {
      const currentTime = new Date().toLocaleTimeString();
      setLastChanged(currentTime);
    };


  
    return (
      <Navbar
        color={fixedNavbar ? "white" : "transparent"}
        className={`rounded-xl transition-all ${
          fixedNavbar
            ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
            : "px-0 py-1"
        }`}
        fullWidth
        blurred={fixedNavbar}
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="capitalize">
            <Breadcrumbs
              className={`bg-transparent p-0 transition-all ${
                fixedNavbar ? "mt-1" : ""
              }`}
            >   
              {/* <Link to={`/${layout}`}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                >
                  {layout}
                </Typography>
              </Link> */}
              {/* <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {page}
              </Typography> */}
            </Breadcrumbs>
            {/* <Typography variant="h6" color="blue-gray">
              {page}
            </Typography> */}
            
          </div>
          <div className="flex items-center">
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
            </IconButton>

              {/* <button className="ButtonLogOut" onClick={async () => logout()}>
                
                <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                
                <div className="text-2">Logout</div>
              </button> */}

          </div>         
        </div>
      </Navbar>
    );
  }