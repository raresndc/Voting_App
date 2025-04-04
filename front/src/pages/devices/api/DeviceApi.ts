import { mapToStringGetParameters } from "session/BackendApi.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { BACKEND_URL } from "session/Session.ts";
import { get, post } from "../../../session/HttpRequest.ts";
import { DeviceDao, DevicePasswordDao } from "../dao/DeviceDao.ts";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export async function getAllDevices(params?: Map<string,string>) : Promise<PageableTemplate<DeviceDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/device/all" + paramsStr);

    return response;
}

export async function getAllDevicesNotPaginated(params?: Map<string,string>) : Promise<PageableTemplate<DeviceDao>> {

    let response = await get(BACKEND_URL + "/device/all-not-paginated" );

    return response;
}

export async function getOneDevice(id: any) : Promise<DeviceDao> {

    let response = await get(BACKEND_URL + "/device/getOne?id=" + id);

    return response;
}

export async function saveDevice(entity: DeviceDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/save");

    return response;
}

export async function updateDevice(entity: DeviceDao) {

    entity.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/update");

    return response;
}

export async function updatePasswordDevice(entity: DevicePasswordDao) {

    entity.device.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/update-pass");

    return response;
}

export async function deleteDevice(entity: DeviceDao) {

    entity.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/delete");

    return response;
}

export async function factoryResetDevice(entity: DevicePasswordDao) {

    entity.device.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/reset");

    return response;
}

export async function addRouterMasterApi(entity: DeviceDao) {

    entity.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/assign-router-master");

    return response;
}

export async function addRouterUserApi(entity: DeviceDao) {

    entity.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/assign-router-user");

    return response;
}

export async function deleteRouterUserApi(entity: DeviceDao) {

    entity.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/delete-router-user");

    return response;
}