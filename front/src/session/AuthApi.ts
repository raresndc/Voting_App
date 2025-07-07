import { get, post, postFormData } from "./HttpRequest.ts";
import { AUTH_BACKEND_URL } from "./Session.ts";

export async function login(username: string, password: string) {
  let body = JSON.stringify({ username, password });
  let response = await post(body, AUTH_BACKEND_URL + "/api/auth/login");
  return response;
}
