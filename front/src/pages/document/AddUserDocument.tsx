import React from "react";
import { useEffect, useState } from "react";
import { uploadDoc } from "session/BackendApi.ts";
import Swal from "sweetalert2";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Input,
  Button,
  CardHeader,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Select,
  Option,
} from "@material-tailwind/react";

export default function AddUserDocument() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setTitle(file.name);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const response = await uploadDoc(formData);

      // Handle successful upload
      console.log("Document uploaded:", response);
      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "The document has been uploaded!",
        allowEscapeKey: false,
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });

      // Clear form after successful upload

      setFile("");
      setTitle("");
      setDescription("");
    } catch (error) {
      // Handle upload error
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: "Error uploading the file",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card className="mx-3 mt-10 mb-6 lg:mx-4">
        <CardHeader
          variant="gradient"
          className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="gray">
            Upload Documents
          </Typography>
        </CardHeader>

        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6"></div>
          <div className="grid-cols-1 mb-12 grid gap-2 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
            </div>
            <form
              className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7"
              onSubmit={handleSubmit}
            >
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  label="File name:"
                  required
                />

                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="File description:"
                  required
                />

                <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                  <div className="md:flex">
                    <div className="w-full p-3">
                      <div className="relative h-48 rounded-lg border-2 border-gray-400 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                        <div className="absolute flex flex-col items-center w-full text-center">
                          <img
                            alt="File Icon"
                            className="mb-3"
                            src="https://img.icons8.com/dusk/64/000000/file.png"
                          />
                          {fileName ? (
                            <span className="flex justify-center items-center w-full text-gray-700 font-semibold">
                              {fileName}
                            </span>
                          ) : (
                            <>
                              <span className="block text-gray-500 font-semibold">
                                Drag & drop your files here
                              </span>
                              <span className="block text-gray-400 font-normal mt-1">
                                or click to upload
                              </span>
                            </>
                          )}
                        </div>
                        <input
                          className="h-full w-full opacity-0 cursor-pointer"
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="buttonDeviceType"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
