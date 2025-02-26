import { XMarkIcon } from "@heroicons/react/24/solid";

import { Card, CardBody, Avatar, Button, IconButton, Typography } from "@material-tailwind/react";
import {setOpenSidenav, useMaterialTailwindController } from "context/index.tsx";
import { Link, NavLink } from "react-router-dom";

import { Collapse } from 'react-collapse';


import React, {useEffect, useState } from "react";

import GlobalState from "session/GlobalState.ts";

import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "../pages/routers/dao/RouterDao.ts";
import {getAllRouters } from "../pages/routers/api/RouterApi.ts";  
import StatusRouter from "components/StatusRouter.tsx";


// export default function Sidebar({ brandImg, brandName, routes }) {


//     const [controller, dispatch] = useMaterialTailwindController();
//     const { sidenavColor, sidenavType, openSidenav } = controller;
//     const sidenavTypes = {
//       dark: "bg-gradient-to-br from-blue-gray-500 to-indigo-900",
//       white: "bg-white shadow-lg",
       
//     };


//     const [open, setOpen] = useState(false);
//     const toggleOpen = () => setOpen(cur => !cur);
  
//     const [collapseOpen, setCollapseOpen] = useState(false);
    
//     const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
//     const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
//     const [modifyState, setModifyState] = useState(false);
  
//     const toggleCollapse = () => {
//       setModifyState(!modifyState);
//       setCollapseOpen(!collapseOpen);
//     };
  
//     useEffect(() => {
//       readDao();
//     },[modifyState, pagination])
  
//     function reloadState() {
//       setModifyState(!modifyState);
//     }
  
//     function readDao() {
//       var params = new Map();
//       params.set("pageIndex", pagination.pageIndex);
//       params.set("pageSize", pagination.pageSize);
//       getAllRouters(params).then(res => setEntity(res))
//     }



//     return (
//       <aside
//         className={`${sidenavTypes[sidenavType]} ${
//           openSidenav ? "translate-x-0" : "-translate-x-80"
//         } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
//       >
//         <div
//           className={`relative border-b ${
//             sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
//           }`}
//         >
//           <Link to="/dashboard/home" className="flex items-center gap-4 py-6 px-8">
//             <Avatar src={brandImg} size="sm" />
//             <Typography
//               variant="h6"
//               color={sidenavType === "dark" ? "white" : "blue-gray"}
//             >
//               {brandName}
//             </Typography>
//           </Link>
//           <IconButton
//             variant="text"
//             color="white"
//             size="sm"
//             ripple={false}
//             className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
//             onClick={() => setOpenSidenav(dispatch, false)}
//           >
//             <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
//           </IconButton>
//         </div>
//         <div className="m-4">
//           {routes.map(({ layout, title, pages, privileges }, key) => (
//             <>
//             <ul key={key} className="mb-4 flex flex-col gap-1">
//               {title && (
//                 <li className="mx-3.5 mt-4 mb-2">
//                   <Typography
//                     variant="small"
//                     color={sidenavType === "dark" ? "white" : "blue-gray"}
//                     className="font-black uppercase opacity-75"
//                   >
//                     {title}
//                   </Typography>
//                 </li>
//               )}
//               {pages.filter((x) => (x.icon !== undefined && x.privileges?.indexOf(GlobalState.role) > -1)).map(({ icon, name, path }) => (
//                 <li key={name}>
//                   <NavLink to={`/${layout}${path}`}>
//                     {({ isActive }) => (
//                       <Button
//                         variant={isActive ? "gradient" : "text"}
//                         color={
//                           isActive
//                             ? sidenavColor
//                             : sidenavType === "dark"
//                             ? "white"
//                             : "blue-gray"
//                         }
//                         className="flex items-center gap-4 px-4 capitalize"
//                         fullWidth
//                       >
//                         {icon}
//                         <Typography
//                           color="inherit"
//                           className="font-medium capitalize"
//                         >
//                           {name}
//                         </Typography>
                        
//                       </Button>

                        




//                     )}

                    
//                   </NavLink>

//                 </li>
//               ))}
//             </ul>
//             </>
//           ))}

//         </div>
//       </aside>



//     );
// }






export default function Sidebar({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-gray-500 to-indigo-900",
    white: "bg-white shadow-lg",
  };

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(cur => !cur);

  const [collapseOpen, setCollapseOpen] = useState(true);
  
  const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

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

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
    >
      <div
        className={`relative border-b ${
          sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
        }`}
      >
        <Link to="/dashboard/home" className="flex items-center gap-4 py-6 px-8">
          <Avatar src={brandImg} size="sm" />
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-2 max-h">
        {routes.map(({ layout, title, pages, privileges }, key) => (
          
            <><ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages
              .filter(
                (x) => x.icon !== undefined &&
                  x.privileges?.indexOf(GlobalState.role) > -1
              )
              .map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"}
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
          <StatusRouter></StatusRouter>
          </>
        ))}
      </div>
    </aside>
  );
}
