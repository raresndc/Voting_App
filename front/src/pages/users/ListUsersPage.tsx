import {
  ArrowLongRightIcon,
  LockOpenIcon,
  PencilSquareIcon,
  TrashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteUserApi,
  getAllUsersPaginatedApi,
  unlockUserApi,
} from "session/BackendApi.ts";
import { UserDao, CreateUserDao } from "session/dao/Dao.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import Swal from "sweetalert2";

import "./style/UserStyles.css";
import { LockIcon, LockKeyholeOpen, LockOpen, Trash2 } from "lucide-react";

export default function ListUtilizatoriPage() {
  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [users, setUsers] = useState<PageableTemplate<UserDao>>();

  const [modifyState, setModifyState] = useState(false);

  useEffect(() => {
    readUsers();
  }, [modifyState, pagination]);

  function readUsers() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllUsersPaginatedApi(params).then((res) => setUsers(res));
  }

  function onPageChange(newPage: number) {
    setPagination((pagination) => ({ ...pagination, pageIndex: newPage }));
  }

  function reloadState() {
    setModifyState(!modifyState);
  }

  async function unlockUser(username: any) {
    try {
      let user: CreateUserDao = { username: username };
      await unlockUserApi(user);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User successfully unlocked!",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      reloadState();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  async function deleteUser(username: any) {
    try {
      Swal.fire({
        title: "Are you sure you want to delete the user '" + username + "' ?",
        showDenyButton: true,
        confirmButtonText: "I am sure!",
        denyButtonText: `No!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let user: CreateUserDao = { username: username };
            await deleteUserApi(user);
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "User successfully deleted!",
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            reloadState();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err,
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
          }
        } else if (result.isDenied) {
          Swal.fire("User not deleted!", "", "info");
        }
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err });
    }
  }

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredUsers = users?.content.filter((user) => {
    // Check if the user's accountNonLocked property matches the filter
    if (searchQuery === "locked") {
      if (!user.accountNonLocked) return true;
    } else if (searchQuery === "unlocked") {
      if (user.accountNonLocked) return true;
    } else if (searchQuery === "") {
      return true; // If no filter is applied, show all users
    }

    // Filter based on the search query
    return Object.values(user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="indigo"
          className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="gray">
            Users
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {/* <Link to="/dashboard/add-user">
            <Button
              variant="text"
              className="inline-flex items-center gap-2"
              color="gray"
            >
              Create user
              <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
            </Button>
          </Link> */}
          <div className="flex items-center gap-2">
      <Pagination
        _page={pagination}
        totalCount={users?.totalElements}
        onPageChanged={onPageChange}
      />

      <div className="flex items-center gap-2 p-1 rounded-lg  border shadow-sm w-[400px] text-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-[150px] h-[30px] px-2 rounded-full outline-none transition border border-gray-300 focus:border-blue-500"
        />

        <label className="flex-1 text-center cursor-pointer">
          <input
            type="radio"
            name="filter"
            id="all"
            value=""
            checked={searchQuery === ""}
            onChange={handleSearchChange}
            className="hidden"
          />
          <span className="block py-1 rounded-lg text-gray-700 transition-all hover:bg-gray-200 active:bg-gray-300 font-medium">
            All
          </span>
        </label>

        <label className="flex-1 text-center cursor-pointer">
          <input
            type="radio"
            name="filter"
            id="locked"
            value="locked"
            checked={searchQuery === "locked"}
            onChange={handleSearchChange}
            className="hidden"
          />
          <span className="block py-1 rounded-lg text-gray-700 transition-all hover:bg-gray-200 active:bg-gray-300 font-medium">
            Locked
          </span>
        </label>

        <label className="flex-1 text-center cursor-pointer">
          <input
            type="radio"
            name="filter"
            id="unlocked"
            value="unlocked"
            checked={searchQuery === "unlocked"}
            onChange={handleSearchChange}
            className="hidden"
          />
          <span className="block py-1 rounded-lg text-gray-700 transition-all hover:bg-gray-200 active:bg-gray-300 font-medium">
            Unlocked
          </span>
        </label>
      </div>
    </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="whitespace-nowrap">
                {[
                  "Locked",
                  "Name & Surname",
                  "CNP",
                  "Citizenship",
                  "Gender",
                  "Adress",
                  "Phone no.",
                  "Email",
                  "Birthday",
                  // "Blood type",
                  // "Height & Weight",
                  "Username",
                  "Role",
                  "Last auth",
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
              {filteredUsers?.map((user, index) => {
                const className = `py-2 px-1 ${
                  index === users.content.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                return (
                  <tr key={user.username}>
                    <td className={className}>
                      <Chip
                      
                        variant="gradient"
                        color={user.accountNonLocked ? "teal" : "red"}
                        value={
                          user.accountNonLocked ? (
                            <LockOpenIcon strokeWidth={2} className="h-4 w-4" />
                          ) : (
                            <LockClosedIcon
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                          )
                        }
                        className="py-2.5 px-2  text-[11px] font-medium ml-5"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.name} {user?.prenume}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.cnp}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className=" text-xs font-semibold text-blue-gray-600">
                        {user?.cetatenie}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.gender}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.localitate} {user?.judet} {user?.tara}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.phoneNumberString}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.birthday} ({user?.age})
                      </Typography>
                    </td>
                    {/* <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.grupaSanguina}
                      </Typography>
                    </td> */}
                    {/* <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.weight} & {user?.height}
                      </Typography>
                    </td> */}
                    <td className={className}>
                      <div className="flex items-center gap-4 ">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {user.username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user?.roles[0]?.name}
                      </Typography>
                    </td>

                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 whitespace-nowrap">
                        {user?.lastTimeLogged
                          ?.replaceAll("T", " ")
                          .slice(0, 19)}
                      </Typography>
                    </td>
                    {/* <td className={className}>
                      <Link to={`/dashboard/modify-user/${user.username}`}>
                        <Tooltip content="Edit">
                          <Button className="flex items-center gap-3 bg-gray-600">
                            <PencilSquareIcon
                              strokeWidth={2}
                              className="h-5 w-5"
                            />
                          </Button>
                        </Tooltip>
                      </Link>
                    </td> */}
                    {/* <td className={className}>
                      <Tooltip content="Unlock">
                        <Button
                          onClick={() => unlockUser(user.username)}
                          color="teal"
                        >
                          <LockOpenIcon strokeWidth={2} className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                    </td>
                    <td className={className}>
                      <Tooltip content="Delete">
                        <Button
                          className="flex items-center gap-3 bg-red-900"
                          color="red"
                          onClick={() => deleteUser(user.username)}
                        >
                          <TrashIcon strokeWidth={2} className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                    </td> */}

                      <td className={className}>
                          <Tooltip content="Unlock">
                            <button onClick={() => unlockUser(user.username)} className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                              <LockOpen strokeWidth={2} className="h-5 w-5" />
                            </button>
                          </Tooltip>
                          </td>
                          <td className={className}>
                        <Tooltip content="Delete">
                          <button
                            onClick={() => deleteUser(user.username)}
                            className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                          >
                            <Trash2 strokeWidth={2} className="h-5 w-5" />
                          </button>
                        </Tooltip>
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
