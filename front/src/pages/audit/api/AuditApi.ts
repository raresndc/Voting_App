import { mapToStringGetParameters } from "session/BackendApi.ts";
import { BACKEND_URL } from "session/Session.ts";
import { get, post } from "../../../session/HttpRequest.ts";
import { AuditDao, AuditRequestDao } from "../dao/AuditDao.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";

export async function getAudit(params?: Map<string,string>) : Promise<PageableTemplate<AuditDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/audit/getAuditPageable" + paramsStr);

    return response;
}