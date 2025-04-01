import { PaginationModel } from "components/PaginationModel";
import { useEffect, useState } from "react";
import { PageableTemplate } from "session/dao/PageableDao";
import { RouterDao } from "pages/routers/dao/RouterDao";
import { useParams } from "react-router-dom";
import { getAllRouters } from "pages/routers/api/RouterApi";

export default function SelectRouters() {

    // id
    const params = useParams();
    
    const [pagination, setPagination] = useState<PaginationModel>({pageIndex: 0, pageSize: 10});
    const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
    const [modifyState, setModifyState] = useState(false); 

    useEffect(() => {
        readDao();
      },[])
    
    function readDao() {
    getAllRouters().then(res => setEntity(res))
    }

   
}