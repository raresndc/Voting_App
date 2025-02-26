import { XMarkIcon } from "@heroicons/react/24/solid";

import { Card, CardBody, Avatar, Button, IconButton, Typography } from "@material-tailwind/react";
import {setOpenSidenav, useMaterialTailwindController } from "context/index.tsx";
import { Link, NavLink } from "react-router-dom";

import { Collapse } from 'react-collapse';


import React, {useEffect, useState } from "react";

import GlobalState from "session/GlobalState.ts";

import { PaginationModel } from "components/PaginationModel.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { RouterDao } from "../pages/routers/dao/RouterDao.ts";
import {getAllRouters } from "../pages/routers/api/RouterApi.ts";  

import './RouterStyle.css'
import './style/ComponentsStyle.css'

import Swal from "sweetalert2";

export default function StatusRouter() {

    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(cur => !cur);
  
    const [collapseOpen, setCollapseOpen] = useState(false);
    
    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
    const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
    const [modifyState, setModifyState] = useState(false);
  
    const toggleCollapse = () => {
        reloadState();
        setCollapseOpen(!collapseOpen);
    };
  
    useEffect(() => {
      readDao();
    },[modifyState, pagination])
  
    function reloadState() {
      setModifyState(!modifyState);
    }
  
    function readDao() {
      var params = new Map();
      params.set("pageIndex", pagination.pageIndex);
      params.set("pageSize", pagination.pageSize);
      getAllRouters(params).then(res => setEntity(res))
    }

    return (
        <>
        {/* <React.Fragment> */}
        <div>

              <button 
              className= {""
              + (entity?.content?.filter( x => x.status === "Unreachable").length === 0 ? " buttonRouter" : " buttonRouter2")}
              onClick={toggleCollapse}
              >
              {collapseOpen ? "Close" : "Open"} Router Status
              </button>


              <Collapse isOpened={collapseOpen}>
                <Card className="my-4 mx-auto w-12/12 "> 
                  <CardBody style={{ maxHeight: '210px', overflowY: 'auto' }}>
                    <Typography>
                      {entity?.content?.map((router, index) => (
                        <div
                          key={router.id}
                          style={{
                            color: router.status === "Reachable" ? "green" : "red",
                            borderBottom: index !== entity.content.length - 1 ? "1px solid #ccc" : "none",
                            paddingBottom: index !== entity.content.length - 1 ? "5px" : "0",
                            marginBottom: index !== entity.content.length - 1 ? "5px" : "0",
                          }}
                        >
                          {router.routerName} - {router.status} - {router.routerIp}
                          
                        </div>
                      ))}
                    </Typography>
                  </CardBody>
                </Card>
              </Collapse>
            </div>
          {/* </React.Fragment> */}










        </>
    )

}