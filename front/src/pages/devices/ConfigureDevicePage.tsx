import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Button,
} from "@material-tailwind/react";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  EnvelopeOpenIcon,
  ArrowDownIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  FireIcon,
  CpuChipIcon,
  FlagIcon,
  GlobeAltIcon,
  UserIcon
} from "@heroicons/react/24/solid";

import OnOffComponent from "./config-components/OnOffComponent.tsx";
import CommandComponent from "./config-components/CommandComponent.tsx";
import SendMessagesComponent from "./config-components/SendMessagesComponent.tsx";
import ReceivedMessagesComponent from "./config-components/ReceivedMessagesComponent.tsx";
import { getAllCommands, sendCommandDevice } from "./api/CmdApi.ts";
import StatisticsCard from "components/StatisticsCard.tsx";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { TemperatureIntervalDao, CmdDao } from "./dao/CmdDao.ts";
import { DeviceDao } from "./dao/DeviceDao.ts";
import { getOneDevice } from "./api/DeviceApi.ts";
import Swal from "sweetalert2";
import GlobalState from "session/GlobalState.ts";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import StatisticsCardDevice from "components/StatisticCardDevice.tsx";

import { FaFacebook, FaTwitter, FaInstagram, FaFlag, FaGlobe, FaUser } from "react-icons/fa";

export default function ConfigureDevicePage() {

  // id
  const params = useParams();

  const [tempParams, setTempParams] = useState<TemperatureIntervalDao>({tMin: 7, tMax: 17, warmingCoolingMode: true});
  const [device, setDevice] = useState<DeviceDao>({id: 0, deviceMsisdn: "", devicePhone: "", deviceDetails: "", deviceLocation: "", deviceName: "", masterActivated: false, userActivated: false, elRouter: null, elDeviceType: null, masterRouter: null, users : null});
  const [commands, setCommands] = useState<PageableTemplate<CmdDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});

  useEffect(() => {
    getOneDevice(params.id).then(res => setDevice(res));
    getAllCommands().then(res => setCommands(res));
  }, [])
  
  function extractCommandsForDevice() {

    var commandsDevice: CmdDao[] = [];

    for (var command of commands.content) {
      //if(command.elDevice?.id === device.id)
      commandsDevice.push(command);
    }

    return commandsDevice;
  }

  async function statusCommand() {
    
    try{

      var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};

      var commandsDevice: CmdDao[] = extractCommandsForDevice();

      for (var command of commandsDevice) {
        if(command.cmdName === "STATUS") {
          commandSelected = command;
          break;
        }
      }
      
      Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: null});

      Swal.fire({icon: 'success', title: 'Succes!', text: 'Comanda status transmisa cu succes!', allowEscapeKey: false, allowOutsideClick: false})
      
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

  }

  async function temperatureCommand() {
    
    try{

      var commandSelected: CmdDao = {id: 0, cmdName: "", cmdSyntax: "", elDevice: null, elSmsSend: null};

      var commandsDevice: CmdDao[] = extractCommandsForDevice();

      for (var command of commandsDevice) {
        if(command.cmdName === "TEMP INFO") {
          commandSelected = command;
          break;
        }
      }
      
      Swal.fire({title: 'Loading ... ', text: 'Asteptati trimiterea comenzii catre dispozitiv', allowEscapeKey: false, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }})

      await sendCommandDevice({elCmd: commandSelected, elDevice: device, temperatureInterval: null});

      Swal.fire({icon: 'success', title: 'Succes!', text: 'Comanda info temperatura transmisa cu succes!', allowEscapeKey: false, allowOutsideClick: false})
      
    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err, allowEscapeKey: false, allowOutsideClick: false})
    }

  }

  const candidate = {
    name: `${device.deviceName}`,
    title: "Presidential Candidate 2025",
    bio: `${device.deviceName} is a visionary leader with years of experience in public service. He is dedicated to bringing change, unity, and prosperity to our nation. His policies focus on economic growth, environmental sustainability, and social welfare.`,
    policies: [
      { icon: <FaFlag className="w-5 h-5 text-blue-500" />, text: "Economic Growth & Job Creation" },
      { icon: <FaGlobe className="w-5 h-5 text-green-500" />, text: "Climate Change & Sustainability" },
      { icon: <FaUser className="w-5 h-5 text-red-500" />, text: "Healthcare & Education Reform" },
    ],
    news: [
      `${device.deviceName} announces new healthcare reform initiative.`,
      "Economic policy plans unveiled to create 10M new jobs.",
      "Upcoming rally in Washington, D.C. this weekend.",
    ],
  };

  const candidatePhotos = {
    "Marcel Ciolacu": "/marcel-ciolacu.jpeg", // Path to image for Marcel Ciolacu
    "Nicolae Ciucă": "/nicolae-ciuca.jpg",  // Path to image for Nicolae Ciucă
  };

  const candidateImage = candidatePhotos[candidate.name] || "/path/to/default-image.jpg"; // Default image fallback


  return (
    <>
<div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Banner */}
      {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-48 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-lg z-0">
        <div className="absolute inset-0 flex items-center justify-center text-gray text-3xl font-bold">
          {candidate.name}'s Campaign
        </div>
      </div> */}

      

      {/* Profile Card */}
      <Card className="relative w-full max-w-3xl  shadow-lg rounded-xl z-10 bg-white">
        <div className="p-8 text-center">
          <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
              <img src={candidateImage} alt={candidate.name} className="w-full h-full object-cover" />
            </div>
            <Typography variant="h4" className="mt-4 font-bold text-gray-800">
              {candidate.name}
            </Typography>
            <Typography variant="subtitle" className="text-gray-600">
              {candidate.title}
            </Typography>
          </div>

          {/* Biography Section */}
          <div className="mt-6 text-left">
            <Typography variant="h6" className="font-bold text-gray-800">
              About {candidate.name}
            </Typography>
            <Typography className="mt-2 text-gray-600">
              {candidate.bio}
            </Typography>
          </div>

          {/* Key Policies */}
          <div className="mt-6">
            <Typography variant="h6" className="font-bold text-gray-800">
              Key Policies
            </Typography>
            <ul className="mt-2 space-y-2 text-gray-600">
              {candidate.policies.map((policy, index) => (
                <li key={index} className="flex items-center gap-2">
                  {policy.icon} {policy.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent News Section */}
          <div className="mt-6 text-left">
            <Typography variant="h6" className="font-bold text-gray-800">
              Recent News
            </Typography>
            <ul className="mt-2 space-y-2 text-gray-600">
              {candidate.news.map((item, index) => (
                <li key={index}>&ldquo;{item}&rdquo;</li>
              ))}
            </ul>
          </div>

          {/* Social Media & Support Button */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md">
              Support {candidate.name}
            </Button>
            <div className="flex gap-4">
              <Button className="bg-indigo-500 text-white p-2 rounded-full">
                <FaFacebook className="w-5 h-5" />
              </Button>
              <Button className="bg-blue-400 text-white p-2 rounded-full">
                <FaTwitter className="w-5 h-5" />
              </Button>
              <Button className="bg-pink-500 text-white p-2 rounded-full">
                <FaInstagram className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </>
  );
}

export const commandComponents = [
  {
    color: "brown",
    icon: CogIcon,
    title: "Status pacient",
    linkTo: "/dashboard/temperature-control-device"   
  },  
  {
    color: "pink",
    icon: BellAlertIcon,
    // title: "Alerta Temperatura",
    title: "Alert Appointment",
    linkTo: "/dashboard/temperature-alert-device"   
  },
];

