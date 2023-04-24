import { useEffect } from "react";
import axios from "./api/axios";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/auth/user");
        router.push("/join");
      } catch (error) {
        router.push("/login");
      }
    })();
  }, [router]);

  return <div></div>;
}
