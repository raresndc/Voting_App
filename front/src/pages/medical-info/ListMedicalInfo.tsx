import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
// import { ArrowLongRightIcon, MinusCircleIcon, PencilSquareIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";

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
import { PaginationModel } from "components/PaginationModel.ts";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";

import { MedicalInfoDao } from "./dao/MedicalInfoDao.ts";
import Swal from "sweetalert2";

// import axios from "axios";
// import { Collapse } from 'react-collapse';
import { deleteMedicalInfo, getAllMedicalInfo } from "./api/MedicalInfoApi.ts";
import {
  createUserApi,
  mailDataApi,
  getAllRolesApi,
} from "session/BackendApi.ts";
import { CreateUserDao, RoleDao } from "session/dao/Dao.ts";
import {
  Circle,
  Mars,
  NonBinary,
  Transgender,
  Trash2,
  UserRoundPlus,
  Venus,
} from "lucide-react";

export default function ListMedicalInfoPage() {
  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [entity, setEntity] = useState<PageableTemplate<MedicalInfoDao>>();
  const [modifyState, setModifyState] = useState(false);

  const obsceneWords = ["sex", "pula", "coaie"]; // Replace with actual obscene words

  function containsObsceneWord(text) {
    return obsceneWords.some((word) => text.toLowerCase().includes(word));
  }

  //   const [swalFired, setSwalFired] = useState(false);

  async function deleteEntity(entity: any) {
    try {
      Swal.fire({
        title:
          "Sigur vrei sa stergi pacientul '" +
          entity.name +
          " " +
          entity.prenume +
          "' ?",
        showDenyButton: true,
        confirmButtonText: "Sunt sigur!",
        denyButtonText: `Nu!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteMedicalInfo(entity);
            Swal.fire({
              icon: "success",
              title: "Succes!",
              text: "Pacientul a fost sters cu succes!",
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            reloadState();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Eroare",
              text: err,
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
          }
        } else if (result.isDenied) {
          Swal.fire("Pacientul nu a fost sters", "", "info");
        }
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

  function onPageChange(newPage: number) {
    setPagination((pagination) => ({ ...pagination, pageIndex: newPage }));
  }

  useEffect(() => {
    readDao();
  }, [modifyState, pagination]);

  function reloadState() {
    setModifyState(!modifyState);
  }

  function readDao() {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllMedicalInfo(params).then((res) => setEntity(res));
  }

  function generateRandomPassword() {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_-+=<>?";

    const getRandomChar = (characters) => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      return characters.charAt(randomIndex);
    };

    const getRandomPasswordPart = (characters, length) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += getRandomChar(characters);
      }
      return result;
    };

    const password =
      getRandomChar(uppercaseLetters) +
      getRandomChar(lowercaseLetters) +
      getRandomChar(numbers) +
      getRandomChar(specialCharacters) +
      getRandomPasswordPart(
        uppercaseLetters + lowercaseLetters + numbers + specialCharacters,
        8
      );

    // Shuffle the password characters to make it more random
    const shuffledPassword = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return shuffledPassword;
  }

  const password = generateRandomPassword();

  async function createUserFromMedicalInfo(medicalInfo) {
    try {
      // Extract necessary data from medicalInfo
      const userData = {
        username: medicalInfo.username,
        newPassword: password,
        role: "User",
        phoneNumberString: medicalInfo.pacientPhoneNumber,
        name: medicalInfo.name,
        prenume: medicalInfo.prenume,
        gender: medicalInfo.gender,
        age: medicalInfo.age,

        birthday: medicalInfo.birthday,
        cetatenie: medicalInfo.cetatenie,
        cnp: medicalInfo.cnp,
        email: medicalInfo.email,
        adresa: medicalInfo.adresa,

        grupaSanguina: medicalInfo.grupaSanguina,
        height: medicalInfo.height,
        judet: medicalInfo.judet,
        localitate: medicalInfo.localitate,

        tara: medicalInfo.tara,
        weight: medicalInfo.weight,
        notificationSms: false,
      };

      const mailData = {
        to: medicalInfo.email,
        subject: "Your Medical App Account Information",
        body:
          "Dear " +
          medicalInfo.name +
          " " +
          medicalInfo.prenume +
          "\n" +
          "\n" +
          "We trust this message finds you well." +
          "\n" +
          "\n" +
          "We are pleased to inform you that your account for the Medical App has been successfully created." +
          "\n" +
          "\n" +
          "Account Details:" +
          "\n" +
          "- Username: " +
          medicalInfo.username +
          "\n" +
          "- Password: " +
          password +
          "\n" +
          "\n" +
          "For security reasons, we recommend changing your password immediately upon logging in to your new account." +
          "\n" +
          "\n" +
          "Thank you for choosing Medical App. We appreciate your trust in our services." +
          "\n" +
          "\n" +
          "Should you have any questions or require further assistance, feel free to contact our support team." +
          "\n" +
          "\n" +
          "Best regards," +
          "\n" +
          "\n" +
          "The Medical App Team 🩸",
      };

      Swal.fire({
        title: "Info!",
        text: "Are you sure you want to create this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, create user!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then(function (result) {
        if (result.value) {
          createUserApi(userData);
          mailDataApi(mailData);
          Swal.fire("Success!", "Your user has been created.", "success");
          // result.dismiss can be "cancel", "overlay",
          // "close", and "timer"
        } else if (!result.value) {
          Swal.fire("Cancelled", "Your action has been canceled!", "error");
        }
      });
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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="indigo"
          className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="gray">
            Accounts verification
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <Pagination
            _page={pagination}
            totalCount={entity?.totalElements}
            onPageChanged={onPageChange}
          />
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="whitespace-nowrap">
                {[
                  "Name & Surname",
                  "Username",
                  "Gender",
                  "Email",
                  "Phone No.",
                  "CNP",
                  "CITIZENSHIP",
                  "Country",
                  "Judet",
                  "Localitate",
                  "Adress",
                  "BIRTHDAY",
                  "Age",
                  "",
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-7 text-left"
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
              {entity?.content?.map((medical, key) => {
                const isObscene =
                  containsObsceneWord(medical.name) ||
                  containsObsceneWord(medical.username);
                const className = `py-3 px-5 whitespace-nowrap ${
                  key === entity.content.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                } ${isObscene ? "bg-red-200 text-white" : ""}`;

                return (
                  <tr
                    key={medical.id}
                    className={isObscene ? "bg-red-200" : ""}
                  >
                    <td className={className}>
                      <Typography
                        variant="small"
                        // color="blue-gray"
                        className="font-semibold whitespace-nowrap"
                      >
                        {medical.name} {medical.prenume}
                      </Typography>
                      {isObscene && (
                        <Typography className="text-xs text-white font-bold">
                          ⚠️ Contains obscene language
                        </Typography>
                      )}
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue"
                        className="font-semibold"
                      >
                        {medical.username}
                      </Typography>
                    </td>
                    <td className={className}>
                      {medical.gender === "masculin" && (
                        <Tooltip content="Masculin">
                          <Mars />
                        </Tooltip>
                      )}
                      {medical.gender === "feminin" && (
                        <Tooltip content="Feminin">
                          <Venus />
                        </Tooltip>
                      )}
                      {medical.gender === "transgender" && (
                        <Tooltip content="Transgender">
                          <Transgender />
                        </Tooltip>
                      )}
                      {medical.gender === "non-binary" && (
                        <Tooltip content="Non-Binary">
                          <NonBinary />
                        </Tooltip>
                      )}
                      {medical.gender !== "masculin" &&
                        medical.gender !== "feminin" &&
                        medical.gender !== "transgender" &&
                        medical.gender !== "non-binary" && (
                          <Tooltip content="Other">
                            <Circle />
                          </Tooltip>
                        )}
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.pacientPhoneNumber}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.cnp}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.cetatenie}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.tara}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.judet}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.localitate}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.adresa}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.birthday}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold ">
                        {medical.age}
                      </Typography>
                    </td>

                    <td className="py-3 px-5-blue-gray-50 whitespace-nowrap">
                      <Tooltip content="Delete">
                        <button
                          onClick={() => deleteEntity(medical)}
                          className="rounded-lg px-4 py-2 font-medium  transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                        >
                          <Trash2 strokeWidth={2} className="h-5 w-5" />
                        </button>
                      </Tooltip>

                      <Tooltip content="Create user">
                        <button
                          onClick={() => createUserFromMedicalInfo(medical)}
                          className="rounded-lg px-4 py-2 font-medium transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                        >
                          <UserRoundPlus strokeWidth={2} className="h-5 w-5" />
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
