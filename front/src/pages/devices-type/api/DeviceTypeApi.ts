import { mapToStringGetParameters } from "session/BackendApi.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { DeviceTypeDao } from "../dao/DeviceTypeDao.ts";
import { BACKEND_URL } from "session/Session.ts";
import { get, post } from "../../../session/HttpRequest.ts";

export async function getAllDeviceTypes(params?: Map<string,string>) : Promise<PageableTemplate<DeviceTypeDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/device-type/all" + paramsStr);

    return response;
}

export async function getOneDeviceType(id: any) : Promise<DeviceTypeDao> {

    let response = await get(BACKEND_URL + "/device-type/getOne?id=" + id);

    return response;
}

export async function saveDeviceType(entity: DeviceTypeDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device-type/save");

    return response;
}

export async function updateDeviceType(entity: DeviceTypeDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device-type/update");

    return response;
}

export async function deleteDeviceType(entity: DeviceTypeDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device-type/delete");

    return response;
}