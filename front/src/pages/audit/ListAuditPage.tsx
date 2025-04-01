import { MagnifyingGlassIcon, MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Avatar, Chip, Progress, Button, Input, Tooltip } from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import React, { useEffect, useState } from "react";
import { AuditDao, AuditRequestDao } from "./dao/AuditDao.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { getAudit } from "./api/AuditApi.ts";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import './style/AuditStyles.css'

export default function ListAuditPage() {

  const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});

  const [audit, setAudit] = useState<PageableTemplate<AuditDao>>();

  const [auditRequest, setAuditRequest] = useState<AuditRequestDao>({start: null, stop: null, entityName: ""});

  const [modifyState, setModifyState] = useState(false);

  useEffect(() => {

    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);
    if(auditRequest.start)
      params.set("startDate", convertToFormatDate(auditRequest.start));

    if(auditRequest.stop)
      params.set("endDate", convertToFormatDate(auditRequest.stop));

    if(auditRequest.entityName)
      params.set("entityName", auditRequest.entityName);


    getAudit(params).then(res => setAudit(res))
   },[modifyState, pagination])

   function reloadState() {
    setModifyState(!modifyState);
  }

  function onPageChange(newPage: number) {
   setPagination(pagination => ({...pagination, pageIndex: newPage}));
  }

  function convertToFormatDate(data:string) {

    if(data !== null && data !== "") {
      var parsareData: string[] = data.split("T");
      var parsareDataFaraOra: string[] = parsareData[0].split("-");
      return parsareDataFaraOra[2] + "." + parsareDataFaraOra[1] + "." + parsareDataFaraOra[0] + " " + parsareData[1] + ":00";
    } else {
      return ""
    }
  }

  async function listAudit() {
    try {
    await getAudit().then(res => setAudit(res))
      } catch (err) {
          Swal.fire({icon: 'error', title: 'Eroare', text: err})
      }
  }

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover">
            <Typography variant="h6" color="gray">
              Audit
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            
          {/* <div className="flex w-max gap-4 mt-1 ml-5">
            <Input required size="lg" label="Search by word" type="text" onChange={(e) => { setAuditRequest({...auditRequest, entityName: e.target.value})}}/>
            <Input required size="lg" label="Start date" type="datetime-local" onChange={(e) => { setAuditRequest({...auditRequest, start: e.target.value})}}/>
            <Input required size="lg" label="Stop date" type="datetime-local" onChange={(e) => { setAuditRequest({...auditRequest, stop: e.target.value})}}/>

              <div>
                          <button onClick={reloadState} className="buttonAudit">
                          <div className="flex items-center">
                            <MagnifyingGlassIcon strokeWidth={2} className="h-5 w-5 mr-2" />
                            <span>Search</span>
                          </div>
                        </button>
              </div>
          </div> */}

<div className="grid grid-cols-1 md:flex md:items-center md:gap-x-4 gap-y-2 mt-1 ml-2 mr-2 mb-2">
  <Input
    required
    size="lg"
    label="Search by word"
    type="text"
    onChange={(e) => {
      setAuditRequest({ ...auditRequest, entityName: e.target.value });
    }}
  />
  <Input
    required
    size="lg"
    label="Start date"
    type="datetime-local"
    onChange={(e) => {
      setAuditRequest({ ...auditRequest, start: e.target.value });
    }}
  />
  <Input
    required
    size="lg"
    label="Stop date"
    type="datetime-local"
    onChange={(e) => {
      setAuditRequest({ ...auditRequest, stop: e.target.value });
    }}
  />

  <div className="mr-2">
    <button onClick={reloadState} className="buttonAudit w-full md:w-auto">
      <div className="flex items-center justify-center">
        <MagnifyingGlassIcon strokeWidth={2} className="h-5 w-5 mr-2" />
        <span>Search</span>
      </div>
    </button>
  </div>
</div>

          
          <Pagination _page={pagination} totalCount={audit?.totalElements} onPageChanged={onPageChange}/>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Acces", "Data", "Enityty", "Event", "Ip", "User", "", ""].map((el) => (
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
                {audit?.content.map(
                  (auditElement, key) => {
                    const className = `py-3 px-5 ${
                      key === audit.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={auditElement.id}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {auditElement.acces}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {dayjs(auditElement.date).format('YYYY MM-DD HH:mm:ss ')}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {auditElement.entity}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {auditElement.event}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {auditElement.ip}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {auditElement.username}
                          </Typography>
                        </td>                                    
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    );
  }