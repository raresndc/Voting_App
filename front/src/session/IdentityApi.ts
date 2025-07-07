import { get, postFormData } from "./HttpRequest.ts";
import { IDENTITY_BACKEND_URL } from "./Session.ts";

export async function uploadLiveFace(userId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await postFormData(formData, IDENTITY_BACKEND_URL + `/api/face-photo/${userId}`);
}

export async function compareFaces(userId: string, threshold: number = 50.0) {
  return await get(IDENTITY_BACKEND_URL + `/api/face-compare/${userId}?threshold=${threshold}`);
}
