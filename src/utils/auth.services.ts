import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "";

export type User = {
  _id: string;
  name: string;
  email: string;
};

export const userFromId = (userId: string): Promise<User> => {
  return axios.get(`${BACKEND_URL}/auth/user/${userId}`).then(({ data }) => {
    return data as User;
  });
};
