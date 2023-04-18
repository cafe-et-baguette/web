import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import axios from "./api/axios";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/auth/user");

        const data = response.data;

        console.log(data);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    })();
  }, [router]);

  return <div>Home</div>;
}
