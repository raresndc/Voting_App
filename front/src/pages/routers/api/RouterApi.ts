import { mapToStringGetParameters } from "session/BackendApi.ts";
import { PageableTemplate } from "session/dao/PageableDao.ts";
import { BACKEND_URL } from "session/Session.ts";
import { get, post } from "../../../session/HttpRequest.ts";
import { RouterDao } from "../dao/RouterDao.ts";

export async function getAllRouters(params?: Map<string,string>) : Promise<PageableTemplate<RouterDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/router/all" + paramsStr);

    return response;
}

export async function getOneRouter(id: any) : Promise<RouterDao> {

    let response = await get(BACKEND_URL + "/router/getOne?id=" + id);

    return response;
}

export async function saveRouter(entity: RouterDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/router/save");

    return response;
}

export async function updateRouter(entity: RouterDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/router/update");

    return response;
}

export async function deleteRouter(entity: RouterDao) {

    let body = JSON.stringify(entity);

    let response = await post(body, BACKEND_URL + "/router/delete");

    return response;
}