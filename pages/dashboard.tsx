import "react-toastify/dist/ReactToastify.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import axios from "axios";
import Image from "next/image";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/router";

interface Link {
  fileName: string;
  shortUrl: string;
  originalUrl: string;
  _id: string;
}

interface DashboardProps {
  links: Link[];
}

export default function Dashboard({ links }: DashboardProps) {
  const router = useRouter();
  const handleDelete = async (link: Link) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/delete/`,
        { data: link }
      );
      if (res.status === 204) {
        showSuccessToast("File deleted successfully!");
        router.reload();
      } else {
        showErrorToast("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      showErrorToast("Something went wrong");
    }
  };
  return (
    <div className="m-4">
      <p className="text-center text-3xl">Your Links</p>
      <div className="flex w-10/12 mx-auto flex-wrap">
        {links.map((link) => {
          return (
            <div
              key={link._id}
              className="flex border-2 mx-2 mt-6 border-black p-3">
              <div className="mx-4">
                <p className="text-xl">{link.fileName}</p>
                <a href={link.shortUrl} className="text-lg text-blue-800">
                  {link.shortUrl}
                </a>
              </div>
              <Image
                width={30}
                height={30}
                src="/delete-icon.svg"
                alt="delete icon"
                className="cursor-pointer"
                onClick={() => handleDelete(link)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/links/${session.user?.email}`
      );
      console.log(res);
      return { props: { links: res.data } };
    } catch (err) {
      console.log("error while fetching user links", err);
      return { props: {} };
    }
    return { props: {} };
  } catch (err) {
    console.log("error in get session", err);
    return { props: {} };
  }
}
