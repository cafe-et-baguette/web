import axios from "axios";
import { useRouter } from "next/router";
import React, { SyntheticEvent, useEffect, useState } from "react";

interface ChatRoom {
  _id: string;
  name: string;
  userIds: string[];
  messages: any[]; // update this with the type for your messages
}
interface user {
  _id: string;
  name: string;
  email: string;
  __v: number;
}
function Join() {
  const router = useRouter();
  const handleLogout = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.post("/auth/logout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>();
  const [users, setUsers] = useState<user[]>();
  const [name, setName] = useState<string>();
  useEffect(() => {
    const fetchChats = async () => {
      const chatRoomsResult = await axios.get("/chatroom");
      setChatRooms(chatRoomsResult.data);
      const usersResult = await axios.get("/auth/users");
      setUsers(usersResult.data);
      const userResult = await axios.get("/auth/user");
      setName(userResult.data.name);
    };
    fetchChats();
  }, []);

  const handleCreate = async (emails: string[], name: string) => {
    try {
      const res = await axios.post("/chatroom/create", {
        name,
        emails,
      });
      router.push(`/chatroom/${res.data._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row relative h-14 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg items-center ">
        <h1 className="text-gray-900 text-2xl font-semibold p-2">{name}</h1>
        <button
          onClick={() => router.push("/rename")}
          className=" text-gray-600 rounded-md ml-1 text-base"
        >
          Edit
        </button>
        <button
          className="bg-white text-gray-900 rounded-md px-8 py-1 text-xl ml-auto mr-3"
          onClick={() => router.push("/groups")}
        >
          My Chats
        </button>
        <button
          onClick={handleLogout}
          className="bg-white text-gray-900 rounded-md px-8 py-1 text-xl mr-2"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-row w-auto mt-32 mb-32">
        <div className="w-full h-full m-4">
          <div className="bg-gray-200 sm:rounded-2xl sm:px-5 py-3 h-96 divide-y-2 divide-gray-400">
            <div className="text-center">
              <h1 className=" text-gray-900 text-2xl font-semibold">
                {" "}
                Groups{" "}
              </h1>
            </div>
            <div className="h-80 overflow-y-auto">
              {chatRooms &&
                chatRooms.map((chatRoom) => (
                  <>
                    <div className="flex flex-row items-center bg-white sm:px-5 py-3 space-y-3 m-1">
                      {chatRoom.name}
                      <button
                        key={chatRoom._id}
                        onClick={() => router.push(`/chatroom/${chatRoom._id}`)}
                        className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-auto"
                      >
                        Chat &gt;
                      </button>
                    </div>
                  </>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full h-full m-4">
          <div className="bg-gray-200 sm:rounded-2xl sm:px-5 py-3 h-96 divide-y-2 divide-gray-400">
            <div className="text-center">
              <h1 className=" text-gray-900 text-2xl font-semibold">Chats</h1>
            </div>
            <div className="h-80 overflow-y-auto">
              {users &&
                users.map((user) => (
                  <>
                    <div className="flex flex-row items-center bg-white sm:px-5 py-3 space-y-3 m-1">
                      {user.name}
                      <button
                        key={user.email}
                        onClick={() =>
                          handleCreate(
                            [user.email],
                            `${name} and ${user.name} room`
                          )
                        }
                        className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-auto"
                      >
                        Chat &gt;
                      </button>
                    </div>
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Join;
