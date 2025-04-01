import { ArrowDownIcon, ArrowUpIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { ReceivedSmsDao, SendSmsDao } from "../dao/CmdDao.ts";
import { useParams } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { getOneDevice } from "../api/DeviceApi.ts";
import { DeviceDao } from "../dao/DeviceDao.ts";
import { getSendMessages } from "../api/CmdApi.ts";
import { PaginationModel } from "components/PaginationModel.ts";
import { Pagination } from "components/Pagination.tsx";

export default function SendMessagesComponent({title, iconUp}: {title: string, iconUp: boolean}) {

    // id
    const params = useParams();

    const [sendMessages, setSendMessages] = useState<PageableTemplate<SendSmsDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});

    const icon = EnvelopeOpenIcon;
    const color = "text-green-500";

    useEffect(() => {
      loadData();
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }, [pagination])

    function loadData() {
      // console.log("pageindex:" + pagination.pageIndex)
      var paramsGetSendMessages = new Map();
      paramsGetSendMessages.set("deviceId", params.id);
      paramsGetSendMessages.set("pageSize", pagination.pageSize);
      paramsGetSendMessages.set("pageIndex", pagination.pageIndex); 
      getSendMessages(paramsGetSendMessages).then(res => setSendMessages(res));
    }
 
    function onPageChange(newPage: number) {
     setPagination(pagination => ({...pagination, pageIndex: newPage}));
    }

    return (
        <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6"
        >
        <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
            {
                iconUp ? 
                <ArrowUpIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500"/>
                :
                <ArrowDownIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500"/>
            }
            
            <strong>{title}</strong>
        </Typography>
        </CardHeader>
        <CardBody className="pt-0"> 
          {(sendMessages?.content)?.map(
            ({ command,  senderUser, importDate}, key) => (
              <div key={importDate.toString()} className="flex items-start gap-4 py-3">
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                    key === sendMessages?.content.length - 1
                      ? "after:h-0"
                      : "after:h-4/6"
                  }`}
                >
                  {React.createElement(icon, {
                    className: `!w-5 !h-5 ${color}`,
                  })}
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {"Command: " + command.cmdName}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {"Syntax: " + command.cmdSyntax}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {"User: " + senderUser.username}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {"Timestamp: " + importDate}
                  </Typography>
                </div>
              </div>
            )
          )}
        </CardBody>
        <Pagination _page={pagination} totalCount={sendMessages?.totalElements} onPageChanged={onPageChange}/>
      </Card>
    )
}