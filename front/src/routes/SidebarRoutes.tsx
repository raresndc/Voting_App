import React from "react";
import { HomeIcon, UserCircleIcon, UserGroupIcon, CpuChipIcon, ServerIcon, BellAlertIcon, BookOpenIcon, AdjustmentsVerticalIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import AddUserPage from "pages/users/AddUserPage.tsx";
import ListUsersPage from "pages/users/ListUsersPage.tsx";
import HomePage from "pages/home/HomePage.tsx";
import Profile from "pages/profile/ProfilePage.tsx";
import ModifyUserPage from 'pages/users/ModifyUserPage.tsx';
import ListDevicesPage from "pages/devices/ListDevicesPage.tsx";
import AddDevicesPage from "pages/devices/AddDevicesPage.tsx";
import ModifyDevicePage from "pages/devices/ModifyDevicePage.tsx";
import ListRoutersPage from "pages/routers/ListRoutersPage.tsx";
import AddRouterPage from "pages/routers/AddRouterPage.tsx";
import ModifyRouterPage from "pages/routers/ModifyRouterPage.tsx";
import ListNotificationPage from "pages/notification/ListNotificationPage.tsx";
import ListAuditPage from "pages/audit/ListAuditPage.tsx";
import ConfigureDevicePage from "pages/devices/ConfigureDevicePage.tsx";
import TemperatureControlCommand from "pages/devices/config-components/TemperatureControlCommand.tsx";
import TemperatureAlert from './../pages/devices/config-components/TemperatureAlert.tsx';
import DelayControl from "pages/devices/config-components/DelayControl.tsx";
import ListDevicesToUsers from "pages/admin/ListDevicesToUsers.tsx";
import ListDeviceTypePage from "pages/devices-type/ListDeviceTypePage.tsx";
import AddDeviceTypePage from "pages/devices-type/AddDeviceTypePage.tsx";
import ModifyDeviceTypePage from "pages/devices-type/ModifyDeviceTypePage.tsx";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";

const icon = {
    className: "w-5 h-5 text-inherit",
  };

export const routes = [
    {
      layout: "dashboard",
      pages: [
        {icon: <HomeIcon {...icon} />,name: "Home",path: "/home",element: <HomePage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.USER, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <UserCircleIcon {...icon} />,name: "Profil",path: "/profile",element: <Profile />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.USER, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <UserGroupIcon {...icon} />,name: "Utilizatori",path: "/users",element: <ListUsersPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER]},
        {name: "add-user",path: "/add-user",element: <AddUserPage/>, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN]},
        {name: "modify-user",path: "/modify-user/:username",element: <ModifyUserPage/>},

        {icon: <CpuChipIcon {...icon} />,name: "Dispozitive",path: "/devices",element: <ListDevicesPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.USER, ACCOUNT_TYPES.SUPER_USER]},
        {name: "add-device",path: "/add-device",element: <AddDevicesPage/>},
        {name: "modify-device",path: "/modify-device/:id",element: <ModifyDevicePage/>},
        {name: "configure-device",path: "/configure-device/:id",element: <ConfigureDevicePage/>},
        {name: "temperature-control-device",path: "/temperature-control-device/:id",element: <TemperatureControlCommand/>},
        {name: "temperature-alert-device",path: "/temperature-alert-device/:id",element: <TemperatureAlert/>},
        {name: "oprire-pornire-programata-device",path: "/oprire-pornire-programata-device/:id",element: <DelayControl/>},

        {icon: <WrenchScrewdriverIcon {...icon} />,name: "Tipuri Dispozitive",path: "/device-type",element: <ListDeviceTypePage />, privileges: [ACCOUNT_TYPES.SUPER_USER]},
        {name: "add-device-type",path: "/add-device-type",element: <AddDeviceTypePage/>},
        {name: "modify-device-type",path: "/modify-device-type/:id",element: <ModifyDeviceTypePage/>},

        {icon: <ServerIcon {...icon} />,name: "Routere",path: "/router",element: <ListRoutersPage />, privileges: [ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER]},
        {name: "add-device",path: "/add-router",element: <AddRouterPage/>},
        {name: "modify-device",path: "/modify-router/:id",element: <ModifyRouterPage/>},

        {icon: <AdjustmentsVerticalIcon {...icon} />,name: "Alocare Dispozitive",path: "/asignare-device",element: <ListDevicesToUsers />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <BellAlertIcon {...icon} />,name: "Notificari",path: "/notification",element: <ListNotificationPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.GUEST, ACCOUNT_TYPES.USER, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <BookOpenIcon {...icon} />,name: "Audit",path: "/audit",element: <ListAuditPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN, ACCOUNT_TYPES.SUPER_USER]},
      ],
    }
  ];
  
  export default routes;