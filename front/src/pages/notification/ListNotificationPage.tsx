import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, Avatar, Chip, Progress, Button, Input, Tooltip } from "@material-tailwind/react";
import { Pagination } from "components/Pagination.tsx";
import { PaginationModel } from "components/PaginationModel.ts";
import { getAllReceivedMessages } from "pages/devices/api/CmdApi.ts";
import { ReceivedSmsDao } from "pages/devices/dao/CmdDao.ts";
import React, { useEffect, useState } from "react";
import { PageableTemplate } from "session/dao/PageableDao.ts";

export default function ListNotificationPage() {

  const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});

  const [receivedMessages, setReceivedMessages] = useState<PageableTemplate<ReceivedSmsDao>>();

  const [modifyState, setModifyState] = useState(false);



  useEffect(() => {
    var params = new Map();
    params.set("pageIndex", pagination.pageIndex);
    params.set("pageSize", pagination.pageSize);

    getAllReceivedMessages(params).then(res => setReceivedMessages(res))

   },[modifyState, pagination])

    function onPageChange(newPage: number) {
        setPagination(pagination => ({...pagination, pageIndex: newPage}));
    }

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 bg-cover">
            <Typography variant="h6" color="white">
              Notifications
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Content", "Data", "Status", "Username"].map((el) => (
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
                {receivedMessages?.content.map(
                  (message, key) => {
                    const className = `py-3 px-5 ${
                      key === receivedMessages.content.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={message.id}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {message.content}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-600">
                            {message.msgDate}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-green-500">
                            {message.statusMsg}
                          </Typography>
                        </td>
                        <td className={className}>
                          {/* <Typography className="text-xs font-semibold text-blue-gray-600"> */}
                          <Typography className="text-xs font-semibold text-amber-900">
                            {message.elDevice?.deviceName}
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            <Pagination _page={pagination} totalCount={receivedMessages?.totalElements} onPageChanged={onPageChange}/> 
          </CardBody>
        </Card>
      </div>
    );
  }
