import Cookies from "js-cookie";
import GlobalState from "./GlobalState.ts";
import { post } from "./HttpRequest.ts";

export const BACKEND_URL = process.env.REACT_APP_BACKEND;

export function isAuthenticated() : boolean {

    readSessionFromCookies();

    if(GlobalState.username && GlobalState.username !== "") {
        return true;
    }

    return false;
}

export function readSessionFromCookies() {
    GlobalState.setRole(Cookies.get('role'));
    GlobalState.setUsername(Cookies.get('username'));
}

export function deleteCookies() {
    Cookies.remove('username');
    Cookies.remove('role');
    GlobalState.setRole(undefined);
    GlobalState.setUsername(undefined);
}

export async function login(username: string, password: string) {

    let body = JSON.stringify({
        username: username,
        password: password
    });

    let response = await post(body, BACKEND_URL + "/login");
    readSessionFromCookies();
    return response;
}

export async function forgot(username: string) {

    let body = JSON.stringify({
        username: username
    });

    let response = await post(body, BACKEND_URL + "/forgotPassword");
    return response;
}

export async function checkToken() {

    let response = await post(undefined, BACKEND_URL + "/autorizeUsers");

    return response;
}

export async function logout() {
    let response = await post(undefined, BACKEND_URL + "/logoutUser");
    deleteCookies();
    GlobalState.navigate("/sign-in")
    return response;
}

//TODO de facut error server page