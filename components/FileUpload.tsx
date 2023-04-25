import React, { useState } from "react";
import axios from "axios";
import { showErrorToast, showInfoToast, showSuccessToast } from "../lib/toast";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function FileUpload() {
  const { status, data } = useSession();
  console.log(data);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [shortUrl, setShortUrl] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];

    // Check file size
    if (file?.size > 5242880) {
      // 5 MB in bytes
      setFileError("File is too big! File size limit : 5 MB");
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setFileError("Only jpegs, pngs and gifs are supported!");
      return;
    }
    setSelectedFile(file);
    setFileError(null);
  };

  const handleFileUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (status === "authenticated") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_SERVER}/upload/${data.user?.email}`,
          formData
        )
        .then((res) => {
          console.log(res.data);
          setShortUrl(res.data.shortUrl);
          showSuccessToast("File uploaded successfully!");
          setLoading(false);
        })
        .catch((err) => {
          console.error(`Error uploading file: ${err}`);
          showErrorToast("An unexpected error occurred!");
          setLoading(false);
        });
    } else {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER}/upload`, formData)
        .then((res) => {
          console.log(res.data);
          setShortUrl(res.data.shortUrl);
          showSuccessToast("File uploaded successfully!");
          setLoading(false);
        })
        .catch((err) => {
          console.error(`Error uploading file: ${err}`);
          showErrorToast("An unexpected error occurred!");
          setLoading(false);
        });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl.toString());
    showInfoToast("Copied link to clipboard!");
  };

  return (
    <div className="flex flex-col m-4">
      <input type="file" className="w-1/4" onChange={handleFileSelect} />
      <button
        className={`w-2/12 mt-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 ${
          (!selectedFile || fileError || loading) && "opacity-50"
        }`}
        onClick={handleFileUpload}
        disabled={fileError !== null || selectedFile === null}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {shortUrl && (
        <div className="mt-2 flex">
          Find your uploaded file here:
          <a className="text-blue-500" href={shortUrl}>
            {shortUrl}
          </a>
          <Image
            className="h-6 ml-2 cursor-pointer"
            onClick={copyLink}
            src="/copy-icon.svg"
            alt="copy icon"
            width={24}
            height={24}
          />
        </div>
      )}
      {fileError && <p className="text-red-600 mt-2">{fileError}</p>}
    </div>
  );
}
