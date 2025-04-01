import { mapToStringGetParameters } from "session/BackendApi.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { BACKEND_URL } from "session/Session.ts";
import { get, post } from "../../../session/HttpRequest.ts";
import { CmdDao, ReceivedSmsDao, SendCommandDao, SendSmsDao } from "../dao/CmdDao.ts";

export async function sendCommandDevice(entity: SendCommandDao) {

    entity.elDevice.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/sms/send");

    return response;
}

export async function getAllCommands(params?: Map<string,string>) : Promise<PageableTemplate<CmdDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/cmd/all" + paramsStr);

    return response;
}

export async function getSendMessages(params?: Map<string,string>) : Promise<PageableTemplate<SendSmsDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/sms/getAllSendMessagesByDevice" + paramsStr);

    return response;
}

export async function getReceivedMessages(params?: Map<string,string>) : Promise<PageableTemplate<ReceivedSmsDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/sms/getAllReceivedMessagesByDevice" + paramsStr);

    return response;
}

export async function getAllReceivedMessages(params?: Map<string,string>) : Promise<PageableTemplate<ReceivedSmsDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/sms/received-messages-all" + paramsStr);

    return response;
}