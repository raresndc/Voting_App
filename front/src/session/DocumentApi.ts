import { get, postFormData } from "./HttpRequest.ts";
import { DOCUMENT_BACKEND_URL } from "./Session.ts";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  let response = await postFormData(formData, DOCUMENT_BACKEND_URL + "/api/documents");
  return response;
}

export async function getIdPhoto(userId: string) {
  return await get(DOCUMENT_BACKEND_URL + `/api/id-photo/${userId}`);
}
