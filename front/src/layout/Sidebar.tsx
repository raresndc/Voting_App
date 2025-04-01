import { XMarkIcon } from "@heroicons/react/24/solid";

import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  setOpenSidenav,
  useMaterialTailwindController,
} from "context/index.tsx";
import { Link, NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";

import GlobalState from "session/GlobalState.ts";

import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "../pages/routers/dao/RouterDao.ts";
import { getAllRouters } from "../pages/routers/api/RouterApi.ts";
import StatusRouter from "components/StatusRouter.tsx";
import { logout } from "session/Session.ts";

export default function Sidebar({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-gray-500 to-indigo-900",
    white: "bg-white shadow-lg",
  };

  const [collapseOpen, setCollapseOpen] = useState(true);

  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  useEffect(() => {
    readDao();
  }, [modifyState, pagination]);

  function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);
    getAllRouters(params).then((res) => setEntity(res));
  }

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl transition-transform duration-300 ease-in-out xl:translate-x-0`}
      style={{ zIndex: 9999 }}
    >
      <div className="relative border-b border-gray-200 dark:border-gray-700">
        <Link
          to="/dashboard/home"
          className="flex items-center gap-4 py-6 px-8"
        >
          <Avatar src={brandImg} size="sm" />
          <Typography
            variant="h6"
            className="text-gray-900 dark:text-white font-bold"
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
          <XMarkIcon
            strokeWidth={2.5}
            className="h-5 w-5 text-gray-600 dark:text-white"
          />
        </IconButton>
      </div>
      <div className="m-3">
        {routes.map(({ layout, title, pages, privileges }, key) => (
          <div key={key} className="mb-6">
            {title && (
              <div className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  className="font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {title}
                </Typography>
              </div>
            )}
            <ul className="flex flex-col gap-3">
              {pages
                .filter(
                  (x) =>
                    x.icon !== undefined &&
                    x.privileges?.indexOf(GlobalState.role) > -1
                )
                .map(({ icon, name, path }) => (
                  <li key={name}>
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={isActive ? sidenavColor : "gray"}
                          className={`flex items-center gap-4 px-4 py-3 capitalize rounded-md transition-colors duration-200 ${
                            isActive
                              ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                              : "hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
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
            {key < routes.length - 1 && (
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </div>
      <Button
        onClick={async () => logout()}
        className={`flex items-center gap-4 px-4 py-3 capitalize rounded-md transition-colors duration-200 `}
        fullWidth
        color="gray"
      >
        <Typography color="inherit" className="font-medium capitalize">
          Logout
        </Typography>
      </Button>
    </aside>
  );
}
