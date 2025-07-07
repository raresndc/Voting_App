import React from "react";
import {RectangleGroupIcon ,ClipboardDocumentIcon ,UserIcon, IdentificationIcon, WifiIcon, DocumentIcon ,MapPinIcon, HomeIcon, UserCircleIcon, UserGroupIcon, CpuChipIcon, ServerIcon, BellAlertIcon, BookOpenIcon, AdjustmentsVerticalIcon, WrenchScrewdriverIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
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
import ListMedicalInfoPage from "pages/medical-info/ListMedicalInfo.tsx";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import MapPage from "pages/map/MapPage.js";
import AddUserDocument from "pages/document/AddUserDocument.tsx"
import ListVotePage from "pages/votePage.tsx/ListVotePage.tsx";
import { Blocks, ChartColumn, FileUp, House, IdCard, ListTodo, Loader, MapPinned, Network, ShieldQuestion, User, Users } from "lucide-react";
import VotingStatistics from "pages/statistics/VotingStatistics.tsx";


const icon = {
    className: "w-5 h-5 text-inherit",
  };

export const routes = [
    {
      layout: "dashboard",
      pages: [
        {icon: <House {...icon} />,name: "Home",path: "/home",element: <HomePage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <IdCard {...icon} />,name: "profile",path: "/profile",element: <Profile />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <Users {...icon} />,name: "Users",path: "/users",element: <ListUsersPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SUPER_USER]},
        // {name: "add-user",path: "/add-user",element: <AddUserPage/>, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SISTEM_ADMIN]},
        // {name: "modify-user",path: "/modify-user/:username",element: <ModifyUserPage/>},


        {icon: <Blocks {...icon} />,name: "Political parties",path: "/political-parties",element: <ListDeviceTypePage />, privileges: [ACCOUNT_TYPES.SUPER_USER, ACCOUNT_TYPES.ROLE_SUPER_ADMIN]},
        {name: "add-device-type",path: "/add-device-type",element: <AddDeviceTypePage/>},
        {name: "modify-device-type",path: "/modify-device-type/:id",element: <ModifyDeviceTypePage/>},
        
        {icon: <User {...icon} />,name: "Candidats",path: "/candidats",element: <ListDevicesPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},
      
        {icon: <ListTodo {...icon} />,name: "Vote",path: "/vote",element: <ListVotePage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},
        {icon: <ChartColumn {...icon} />,name: "Statistics",path: "/statistics",element: <VotingStatistics />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},



        {name: "add-doctor",path: "/add-doctor",element: <AddDevicesPage/>},
        {name: "modify-doctor",path: "/modify-doctor/:id",element: <ModifyDevicePage/>},
        {name: "configure-device",path: "/configure-device/:id",element: <ConfigureDevicePage/>},
        {name: "temperature-control-device",path: "/temperature-control-device/:id",element: <TemperatureControlCommand/>},
        {name: "temperature-alert-device",path: "/temperature-alert-device/:id",element: <TemperatureAlert/>},
        {name: "oprire-pornire-programata-device",path: "/oprire-pornire-programata-device/:id",element: <DelayControl/>},
        {icon: <ShieldQuestion {...icon} />,name: "Audit",path: "/audit",element: <ListAuditPage />, privileges: [ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.SUPER_USER]},
        {icon: <FileUp {...icon} />,name: "Doc Upload",path: "/add-doc",element: <AddUserDocument />, privileges: [ ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},

        {icon: <Network {...icon} />,name: "Network",path: "/network",element: <ListRoutersPage />, privileges: [ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.SUPER_USER]},
        {name: "add-device",path: "/add-router",element: <AddRouterPage/>},
        {name: "modify-device",path: "/modify-router/:id",element: <ModifyRouterPage/>},

        // {icon: <AdjustmentsVerticalIcon {...icon} />,name: "Appointements",path: "/assign-doctor",element: <ListDevicesToUsers />, privileges: [ ACCOUNT_TYPES.SUPER_USER, ACCOUNT_TYPES.USER]},


        {icon: <Loader {...icon} />,name: "Pending Accounts",path: "/pending-accounts",element: <ListMedicalInfoPage />, privileges: [ ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.SUPER_USER]},
        {icon: <MapPinned {...icon} />,name: "physical voting locations",path: "/map",element: <MapPage />, privileges: [ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI, ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.ROLE_CANDIDATE, ACCOUNT_TYPES.ROLE_USER, ACCOUNT_TYPES.SUPER_USER]},
        
      ],
    }
  ];
  
  export default routes;