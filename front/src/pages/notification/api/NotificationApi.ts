import { get } from "../../../session/HttpRequest.ts";
import { ReceivedSmsDao } from "pages/devices/dao/CmdDao.ts";
import { mapToStringGetParameters } from "session/BackendApi.ts";
import { BACKEND_URL } from "session/Session.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";

export async function getAllReceivedMessages(params?: Map<string,string>) : Promise<PageableTemplate<ReceivedSmsDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/sms/received-messages-all" + paramsStr);

    return response;
}