import { ArrowDownIcon, ArrowUpIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { ReceivedSmsDao, SendSmsDao } from "../dao/CmdDao.ts";
import { useParams } from "react-router-dom";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { getReceivedMessages } from "../api/CmdApi.ts";
import { PaginationModel } from "components/PaginationModel.ts";
import { Pagination } from "components/Pagination.tsx";

export default function ReceivedMessagesComponent({title, iconUp}: {title: string, iconUp: boolean}) {

    // id
    const params = useParams();

    const [receivedMessages, setReceivedMessages] = useState<PageableTemplate<ReceivedSmsDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
    


    const [latestMessageId, setLatestMessageId] = useState<number | null>(null);

    
    const icon = EnvelopeOpenIcon;
    const color = "text-green-500";
              
    useEffect(() => {
      loadData();
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }, [pagination])

    function loadData() {
      var paramsGetSendMessages = new Map();
      paramsGetSendMessages.set("deviceId", params.id);
      paramsGetSendMessages.set("pageSize", pagination.pageSize);
      paramsGetSendMessages.set("pageIndex", pagination.pageIndex); 
      // getReceivedMessages(paramsGetSendMessages).then(res => setReceivedMessages(res));

      getReceivedMessages(paramsGetSendMessages).then(res => {
        setReceivedMessages(res);
        const newMessages = res.content.filter(message => Number(message.id) > (latestMessageId || 0));
        if (newMessages.length > 0) {
          setLatestMessageId(Number(newMessages[newMessages.length - 1].id));
        }
      });
      
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
                <ArrowDownIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500"/>
                :
                <ArrowDownIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500"/>
            }
            
            <strong>{title}</strong>
        </Typography>
        </CardHeader>
        <CardBody className="pt-0">
          {(receivedMessages?.content).map(
            ({ id, statusMsg, content, importDate, msgDate}, key) => (
              <div key={id} className="flex items-start gap-4 py-3">
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                    key === receivedMessages.content.length - 1
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
                    {"Status: " + statusMsg}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {"content: " + content}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {"Timestamp: " + msgDate}
                  </Typography>
                </div>
              </div>
            )
          )}
        </CardBody>
        <Pagination _page={pagination} totalCount={receivedMessages.totalElements} onPageChanged={onPageChange}/> 
      </Card>
    )
}










// export default function ReceivedMessagesComponent({title, iconUp}: {title: string, iconUp: boolean}) {

//     // id
//     const params = useParams();

//     const [receivedMessages, setReceivedMessages] = useState<PageableTemplate<ReceivedSmsDao>>({content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false});
//     const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 5});


//     const [lastInputIndex, setLastInputIndex] = useState<number>(-1);



    
//     const icon = EnvelopeOpenIcon;
//     const color = "text-green-500";
              
//     useEffect(() => {
//       loadData();
//       const interval = setInterval(loadData, 5000);
//       return () => clearInterval(interval);
//     }, [pagination])

//     function loadData() {
//       var paramsGetSendMessages = new Map();
//       paramsGetSendMessages.set("deviceId", params.id);
//       paramsGetSendMessages.set("size", pagination.pageSize);
//       paramsGetSendMessages.set("pageNumber", pagination.pageIndex);
//       getReceivedMessages(paramsGetSendMessages).then(res => {
//         setReceivedMessages(res);
//         if (res.content.length > 0) {
//           setLastInputIndex(0); // Set the index of the last input to the first input of the new data
//         }
//       });
//     }
    
    

//     function onPageChange(newPage: number) {
//      setPagination(pagination => ({...pagination, pageIndex: newPage}));
//     }

//     return (
//         <Card>
//         <CardHeader
//           floated={false}
//           shadow={false}
//           color="transparent"
//           className="m-0 p-6"
//         >
//         <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
//             {
//                 iconUp ? 
//                 <ArrowUpIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500"/>
//                 :
//                 <ArrowDownIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500"/>
//             }
            
//             <strong>{title}</strong>
//         </Typography>
//         </CardHeader>
//         <CardBody className="pt-0">
//           {(receivedMessages?.content).map(




//             ({ id, statusMsg, content, importDate, msgDate}, key) => (
//               <div
//               key={id}
//               className={`flex items-start gap-4 py-3 ${
//               key === lastInputIndex ? "bg-yellow-200" : "" // Add a class to highlight the last input
//               }`}
//               >




                
//                 <div
//                   className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
//                     key === receivedMessages.content.length - 1
//                       ? "after:h-0"
//                       : "after:h-4/6"
//                   }`}
//                 >
//                   {React.createElement(icon, {
//                     className: `!w-5 !h-5 ${color}`,
//                   })}
//                 </div>
//                 <div>
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="block font-medium"
//                   >
//                     {"Status: " + statusMsg}
//                   </Typography>
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="block font-medium"
//                   >
//                     {"content: " + content}
//                   </Typography>
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="block font-medium"
//                   >
//                     {"Timestamp: " + msgDate}
//                   </Typography>
//                 </div>
//               </div>
//             )
//           )}
//         </CardBody>
//         <Pagination _page={pagination} totalCount={receivedMessages?.totalElements} onPageChanged={onPageChange}/>
//       </Card>
//     )
// }






// export default function ReceivedMessagesComponent({ title, iconUp }: { title: string, iconUp: boolean }) {

//   // id
//   const params = useParams();

//   const [receivedMessages, setReceivedMessages] = useState<PageableTemplate<ReceivedSmsDao>>({ content: [], pageable: null, last: false, totalElements: 0, totalPages: 0, size: 0, number: 0, sort: null, first: false, numberOfElements: 0, empty: false });
//   const [pagination, setPagination] = useState<PaginationModel>({ pageIndex: 0, pageSize: 5 });

  
//   const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);



//  // New state variable for highlighted ID

//   const icon = EnvelopeOpenIcon;
//   const color = "text-green-500";

//   useEffect(() => {
//     loadData();
//     const interval = setInterval(loadData, 5000);
//     return () => clearInterval(interval);
//   }, [pagination]);

//   function loadData() {
//     var paramsGetSendMessages = new Map();
//     paramsGetSendMessages.set("deviceId", params.id);
//     paramsGetSendMessages.set("size", pagination.pageSize);
//     paramsGetSendMessages.set("pageNumber", pagination.pageIndex); 
//     getReceivedMessages(paramsGetSendMessages).then(res => {
//       setReceivedMessages(res);
//       if (res.content.length > 0) {
//         const latestMessageId = res.content[0].id;
//         if (latestMessageId !== highlightedMessageId) {
//           setTimeout(() => setHighlightedMessageId(latestMessageId), 60000);
//           setTimeout(() => setHighlightedMessageId(null), 10000); // Remove highlight after 1 minute (60000 milliseconds)
//         }
//       }
//     });
//   }
  
  
  
  

//   function onPageChange(newPage: number) {
//     setPagination(pagination => ({ ...pagination, pageIndex: newPage }));
//   }

//   return (
//     <Card>
//       <CardHeader
//         floated={false}
//         shadow={false}
//         color="transparent"
//         className="m-0 p-6"
//       >
//         <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
//           {
//             iconUp ?
//               <ArrowUpIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500" />
//               :
//               <ArrowDownIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500" />
//           }

//           <strong>{title}</strong>
//         </Typography>
//       </CardHeader>
//       <CardBody className="pt-0">
//         {(receivedMessages?.content).map(
//           ({ id, statusMsg, content, importDate, msgDate }, key) => (
//             <div key={id} className={`flex items-start gap-4 py-3 ${id === highlightedMessageId ? 'bg-yellow-100' : ''}`}>


//                              <div
//                               className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
//                                 key === receivedMessages.content.length - 1
//                                   ? "after:h-0"
//                                   : "after:h-4/6"
//                               }`}
//                             >

      
//                 {React.createElement(icon, {
//                   className: `!w-5 !h-5 ${color}`,
//                 })}
//               </div>
//               <div>
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className="block font-medium"
//                 >
//                   {"Status: " + statusMsg}
//                 </Typography>
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className="block font-medium"
//                 >
//                   {"content: " + content}
//                 </Typography>
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className="block font-medium"
//                 >
//                   {"Timestamp: " + msgDate}
//                 </Typography>
//               </div>
//             </div>
//           )
//         )}
//       </CardBody>
//       <Pagination _page={pagination} totalCount={receivedMessages?.totalElements} onPageChanged={onPageChange} />
//     </Card>
//   )
// }
