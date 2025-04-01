import { BACKEND_URL } from "session/Session.ts";
import { MedicalInfoDao } from "../dao/MedicalInfoDao";
import { mapToStringGetParameters } from "session/BackendApi.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { get, post} from "../../../session/HttpRequest.ts";

export async function getAllMedicalInfo(params?: Map<string,string>) : Promise<PageableTemplate<MedicalInfoDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/medical-info/all" + paramsStr);

    return response;
}

export async function deleteMedicalInfo(entity: MedicalInfoDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/medical-info/delete");

    return response;
}