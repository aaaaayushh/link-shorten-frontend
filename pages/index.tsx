import Image from "next/image";
import { Inter } from "next/font/google";
import FileUpload from "@/components/FileUpload";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="m-4">
      <p className="text-center text-3xl">
        Upload a file and get a short link to share it!
      </p>
      <FileUpload />
    </div>
  );
}
