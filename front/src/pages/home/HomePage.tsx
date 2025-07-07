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
import { Collapse } from "react-collapse";

import {
  Input,
  Textarea,
  Checkbox,
  Switch,
  MenuHandler,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  BellAlertIcon,
  CpuChipIcon,
  ServerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { ACCOUNT_TYPES } from "session/AccountTypes.ts";
import GlobalState from "session/GlobalState.ts";
import {
  ArrowLongRightIcon,
  MinusCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "../routers/dao/RouterDao.ts";

import { deleteRouter, getAllRouters } from "../routers/api/RouterApi.ts";
import Swal from "sweetalert2";
import "./style/HomeStyle.css";
import { getCurrentUserApi } from "session/BackendApi.ts";
import { CreateUserDao, UserDao } from "session/dao/Dao.ts";

import { changePasswordRandomApi } from "session/BackendApi.ts";

import { Label, Modal, TextInput } from "flowbite-react";

import Form from "react-bootstrap/Form";
import { zip } from "rxjs";
// import Modal from 'react-bootstrap/Modal';

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);

  const [collapseOpen, setCollapseOpen] = useState(false);

  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  const [swalFired, setSwalFired] = useState(false);

  // const [users, setUsers] = useState<PageableTemplate<UserDao>>();
  const [user, setUser] = useState<UserDao>();

  const [createUser, setCreateUser] = useState<CreateUserDao>({
    newPassword: "",
    role: "",
    username: GlobalState.username,
    phoneNumberString: "",
    oldPassword: "",
    email: "",
    tara: "",
    judet: "",
    localitate: "",
    adresa: "",
    notificationSms: null,
  });

  const [repeatPassword, setRepeatPassword] = useState("");

  const regexPass = new RegExp(
    "(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}"
  );
  const regexPhoneNumber = new RegExp("^[0-9]{10}$");
  const regexEmail = new RegExp(
    "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$"
  );

  const [isChecked, setIsChecked] = useState(user?.notificationSms);

  useEffect(() => {}, [modifyState, pagination]);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const label = isChecked ? "Notificari activate" : "Notificari dezactivate";

  useEffect(() => {
    getCurrentUserApi().then((res) => setUser(res));
  }, []);

  async function modifyPassword(ev) {
    ev.preventDefault();
    try {
      if (!regexPass.test(createUser.newPassword)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The password does not respect the constraints. Small letter, capital letter, digit, special character(#?!@$%^&*-_) and minimum size 8 characters, maximum size 24 characters!",
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        return;
      }

      if (createUser.newPassword !== repeatPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The password field is not the same as the password repeat field!",
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        return;
      }

      Swal.fire({
        title: "Loading ... ",
        text: "Wait for the password to be changed.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await changePasswordRandomApi(createUser);

      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "The password has been changed successfully!!",
        allowEscapeKey: false,
        allowOutsideClick: false,
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

  const toggleCollapse = () => {
    setModifyState(!modifyState);
    reloadState();
    setCollapseOpen(!collapseOpen);
  };

  useEffect(() => {
    readDao();
  }, [modifyState, pagination]);

  function reloadState() {
    setModifyState(!modifyState);
  }

  useEffect(() => {
    getCurrentUserApi().then((res) => setUser(res));
  }, []);

  function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);
    getAllRouters(params).then((res) => setEntity(res));
  }

  useEffect(() => {
    setSwalFired(false);
  }, []);

  const [openModal, setOpenModal] = useState(true);

  function onCloseModal() {
    setOpenModal(false);
  }

  return (
    <>
      <div style={{ zIndex: 99999999 }}>
        {!user?.passChanged ? (
          <>
            <Modal
              show={openModal}
              size="sm"
              onClose={onCloseModal}
              position="bottom-center"
              popup
              style={{ zIndex: 99999999 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6">
                  {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change generated password</h3> */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      color="blue-gray-500"
                      className="mb-1"
                    >
                      Change generated password
                    </Typography>
                  </div>
                  <div>
                    <Input
                      value={createUser.oldPassword}
                      type="password"
                      size="lg"
                      label="Old Password"
                      onChange={(e) =>
                        setCreateUser({
                          ...createUser,
                          oldPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Input
                      value={createUser.newPassword}
                      type="password"
                      size="lg"
                      label="New password"
                      onChange={(e) =>
                        setCreateUser({
                          ...createUser,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Input
                      value={repeatPassword}
                      type="password"
                      size="lg"
                      label="Repeat new password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    {/* <button onClick={modifyPassword}>
                      Change password
                    </button> */}
                    <button
                      onClick={modifyPassword}
                      className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]"
                    >
                      <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2">
                        <div className="flex gap-2 items-center">
                          <span className="font-semibold">Change password</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        ) : null}
      </div>

      <div
        className="relative mt-8 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover	bg-center"
        color="indigo"
      >
        {/* bg-blue-500/50 */}
        <div className="absolute inset-0 h-full w-full " />
      </div>

      {GlobalState.role !== ACCOUNT_TYPES.ROLE_CANDIDATE &&
      GlobalState.role !== ACCOUNT_TYPES.ROLE_USER &&
      GlobalState.role !== ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI ? (
        <>
          {entity?.content?.map((router, key) => {
            // getStatusColor(router);
            const className = `py-3 px-5 ${
              key === entity.content.length - 1
                ? ""
                : "border-b border-blue-gray-50"
            }`;
          })}
        </>
      ) : (
        ""
      )}

      {GlobalState.role !== ACCOUNT_TYPES.SUPER_USER &&
      GlobalState.role !== ACCOUNT_TYPES.SUPER_USER ? (
        <>
          {entity?.content?.map((router, key) => {
            // getStatusColor2(router);
            const className = `py-3 px-5 ${
              key === entity.content.length - 1
                ? ""
                : "border-b border-blue-gray-50 "
            }`;
          })}
        </>
      ) : (
        ""
      )}

      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 ">
        <CardBody className="p-4 ">
          <div className="container mx-auto px-4 py-2">
            <Card className="mx-3 lg:mx-4 p-8 shadow-2xl rounded-3xl bg-gradient-to-r from-gray-400 to-indigo-100 text-white">
              <Typography
                variant="h4"
                className="text-center text-white font-bold mb-6"
              >
                About E-Vote
              </Typography>

              {/* <p className="text-black text-lg leading-relaxed text-center">
          E-Vote is a secure and transparent electronic voting platform designed to
          make elections more accessible, efficient, and trustworthy. Our system
          ensures integrity, anonymity, and ease of use for voters and election
          organizers alike.
        </p> */}
              <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                <p className="text-gray-600 text-lg leading-relaxed text-center">
                  E-Vote is a secure and transparent electronic voting platform
                  designed to make elections more accessible, efficient, and
                  trustworthy. Our system ensures integrity, anonymity, and ease
                  of use for voters and election organizers alike.
                </p>
              </Card>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                  <Typography
                    variant="h5"
                    className="text-indigo-700 font-semibold mb-3"
                  >
                    Secure & Transparent
                  </Typography>
                  <p className="text-gray-600">
                    We utilize advanced encryption and blockchain technology to
                    prevent fraud and ensure votes are counted accurately.
                  </p>
                </Card>
                <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                  <Typography
                    variant="h5"
                    className="text-indigo-700 font-semibold mb-3"
                  >
                    User-Friendly Interface
                  </Typography>
                  <p className="text-gray-600">
                    Our intuitive design allows voters to cast their votes with
                    ease, no technical expertise required.
                  </p>
                </Card>
                <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                  <Typography
                    variant="h5"
                    className="text-indigo-700 font-semibold mb-3"
                  >
                    Real-Time Results
                  </Typography>
                  <p className="text-gray-600">
                    Get instant and accurate election results as soon as voting
                    ends, eliminating delays and manual counting errors.
                  </p>
                </Card>
                <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                  <Typography
                    variant="h5"
                    className="text-indigo-700 font-semibold mb-3"
                  >
                    Accessibility for All
                  </Typography>
                  <p className="text-gray-600">
                    Our platform is designed to be inclusive, supporting
                    multiple languages and accessibility features for all users.
                  </p>
                </Card>
              </div>
            </Card>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export const projectsData = [
  {
    img: <ServerIcon className="h-full w-full object-cover" />,
    title: "Routers",
    route: "/dashboard/router",
    privileges: [ACCOUNT_TYPES.ROLE_SUPER_ADMIN, ACCOUNT_TYPES.SUPER_USER],
  },
  {
    img: <UserCircleIcon className="h-full w-full object-cover" />,
    title: "Profile",
    route: "/dashboard/profile",
    privileges: [
      ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI,
      ACCOUNT_TYPES.ROLE_CANDIDATE,
      ACCOUNT_TYPES.ROLE_SUPER_ADMIN,
      ACCOUNT_TYPES.SUPER_USER,
      ACCOUNT_TYPES.ROLE_USER,
    ],
  },

  {
    img: <UserCircleIcon className="h-full w-full object-cover" />,
    title: "Map",
    route: "/dashboard/map",
    privileges: [
      ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI,
      ACCOUNT_TYPES.ROLE_CANDIDATE,
      ACCOUNT_TYPES.ROLE_SUPER_ADMIN,
      ACCOUNT_TYPES.SUPER_USER,
      ACCOUNT_TYPES.ROLE_USER,
    ],
  },

  {
    img: <UserCircleIcon className="h-full w-full object-cover" />,
    title: "User Data",
    route: "/dashboard/medical-info",
    privileges: [
      ACCOUNT_TYPES.ADMINISTRATOR_UTILIZATORI,
      // ACCOUNT_TYPES.GUEST,
      ACCOUNT_TYPES.ROLE_SUPER_ADMIN,
      ACCOUNT_TYPES.SUPER_USER,
      // ACCOUNT_TYPES.USER
    ],
  },
];
