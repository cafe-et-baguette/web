import { useRouter } from "next/router";
import { User, userFromId } from "@/utils/auth.services";
import { useEffect, useState } from "react";
import axios from "axios";
import { Message } from "../chatroom/[roomId]";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "";

function Search() {
  const router = useRouter();

  const roomId =
    typeof router.query.roomId === "string" ? router.query.roomId : "";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (roomId) {
      // Get previous messages
      axios
        .get(`${BACKEND_URL}/chatroom/${roomId}/messages`)
        .then(({ data }) => {
          const previousMessages = data.map((messageResponse: any) => {
            return userFromId(messageResponse.userId).then((user) => {
              return {
                user: user as User,
                roomId: messageResponse.roomId,
                content: messageResponse.content,
                createdDate: new Date(messageResponse.createdDate),
              } as Message;
            });
          });
          Promise.all(previousMessages).then((previousMessages) => {
            setMessages(previousMessages);
          });
        });
    }
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-rose-300 py-3 flex flex-col justify-center">
      <div className="relative px-4 bg-white shadow-lg sm:rounded-3xl sm:p-10 ">
        <div className="text-center">
          <div className="flex flex-row w-1/2">
            <button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-10 py-1 ml-5 "
            >
              Back
            </button>
            <h1 className=" text-gray-900 text-2xl font-semibold ml-auto">
              Search
            </h1>
          </div>
        </div>
        <div className="flex flex-row w-auto ">
          <div className="w-full h-full ">
            <div className="flex flex-row bg-gray-200 shadow-lg sm:rounded-2xl sm:px-5 py-3  h-1/5 mt-1">
              <input
                name="search"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                placeholder="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-5 ">
                Search
              </button>
            </div>
            <div className="relative bg-gray-200 shadow-lg sm:rounded-2xl h-96 mt-2 p-3 overflow-auto">
              {messages
                .filter((message) => message.content.includes(searchQuery))
                .map((message, idx) => {
                  return (
                    <div key={idx}>
                      <div className="flex flex-row w-auto">
                        <div className=" text-gray-700 text-sm font-semibold">
                          {message.user.name} &lt;
                          {message.user.email}&gt;
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-blue-200  rounded-xl flex flex-row w-full">
                        <div className=" break-all text-gray-900 text-sm font-semibold ">
                          {message.content}
                        </div>
                        <div className=" text-gray-400 text-sm font-semibold ml-auto mt-auto">
                          {message.createdDate?.toLocaleTimeString("en-GB")}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Search;
