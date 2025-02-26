import { mapToStringGetParameters } from "session/BackendApi.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { BACKEND_URL, readSessionFromCookies } from "session/Session.ts";
import { get, post } from "../../../session/HttpRequest.ts";
import { AddDeviceUserDao, DeleteDeviceUserDao } from "../dao/DeviceUserDao.ts";

export async function saveDeviceUserApi(entity: AddDeviceUserDao) {

    entity.elDevice.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/assign-user-device");

    return response;
}

export async function deleteDeviceUserApi(entity: DeleteDeviceUserDao) {

    entity.device.users = null;

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/device/delete-user-device");

    return response;
}