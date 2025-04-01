import { get, post, postFormData } from "./HttpRequest.ts";
import { BACKEND_URL, readSessionFromCookies } from "./Session.ts";
import { CreateUserDao, RoleDao, UserDao, CreateMailDao } from "./dao/Dao.ts";
import { PageableTemplate } from "./dao/PageableDao.ts";

//START User API
export async function getAllUsersApi() : Promise<UserDao[]> {
    let response = await get(BACKEND_URL + "/getAllUsersWithRoles");
    return response;
}

export async function getAllUsersPaginatedApi(params?: Map<string,string>) : Promise<PageableTemplate<UserDao>> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/getAllUsersWithRolesPaginated" + paramsStr);
    return response;
}

export async function getCurrentUserApi(params?: Map<string,string>) : Promise<UserDao> {

    let paramsStr = mapToStringGetParameters(params);

    let response = await get(BACKEND_URL + "/getCurrentUser" + paramsStr);
    return response;
}

export async function getAllRolesApi() : Promise<RoleDao[]> {
    let response = await get(BACKEND_URL + "/getAllRoles");
    return response;
}

export async function getDocument() : Promise<RoleDao[]> {
    let response = await get(BACKEND_URL + "/documents/all");
    return response;
}   

export async function createUserApi(user: CreateUserDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/createUserByRole");
    return response;
}

export async function uploadDoc(formData) {

      let response = await postFormData(formData, BACKEND_URL + "/documents/upload");
      return response;
}

export async function forgotPasswordApi(user: CreateUserDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/forgotPassword");
    readSessionFromCookies();
    return response;
}

export async function mailDataApi(user: CreateMailDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/send-email");
    return response;
}


export async function changePasswordByAdminApi(user: CreateUserDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/changePasswordByAdmin");
    readSessionFromCookies();
    return response;
}

export async function changePasswordApi(user: CreateUserDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/changePassword");
    readSessionFromCookies();
    return response;
}

export async function changePasswordRandomApi(user: CreateUserDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/changePasswordRandom");
    readSessionFromCookies();
    return response;
}

export async function changeNotificationsStatusApi(user: CreateUserDao) {

    let body = JSON.stringify(user);

    let response = await post(body, BACKEND_URL + "/notificationStatus");
    readSessionFromCookies();
    return response;
}

export async function changePhoneNumberByAdminApi(user: CreateUserDao) {
    let body = JSON.stringify(user);
    let response = await post(body, BACKEND_URL + "/changePhoneNumberByAdmin");
    readSessionFromCookies();
    return response;
}

export async function changePhoneNumberByUserApi(user: CreateUserDao) {
    let body = JSON.stringify(user);
    let response = await post(body, BACKEND_URL + "/changePhoneNumberByUser");
    readSessionFromCookies();
    return response;
}

export async function changeMailApi(user: CreateUserDao) {
    let body = JSON.stringify(user);
    let response = await post(body, BACKEND_URL + "/changeMail");
    readSessionFromCookies();
    return response;
}

export async function changeFullAdress(user: CreateUserDao) {
    let body = JSON.stringify(user);
    let response = await post(body, BACKEND_URL + "/changeFullAdress");
    readSessionFromCookies();
    return response;
}

export async function unlockUserApi(user: CreateUserDao) {
    let body = JSON.stringify(user);
    let response = await post(body, BACKEND_URL + "/unlockUser");
    readSessionFromCookies();
    return response;
}

export async function deleteUserApi(user: CreateUserDao) {
    let body = JSON.stringify(user);
    let response = await post(body, BACKEND_URL + "/deleteUser");
    readSessionFromCookies();
    return response;
}

//END User API

//START UTILS

export function mapToStringGetParameters(params: Map<string, string>) {
    var urlParams = "";

    if(params && params.size > 0) {
        urlParams += "?";
        params!.forEach((value, key) => {
            if(urlParams.length===1)
                urlParams += key + "=" + value;
            else 
                urlParams += "&" + key + "=" + value;
        })
    }
    return urlParams;
}

//END UTILS