import { useAuth } from "@/context/AuthContext";
import { User, userFromId } from "@/utils/auth.services";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "";

let socket: Socket;
export type Message = {
  user: User;
  roomId: string;
  content: string;
  createdDate?: Date;
};

const ChatRoom = () => {
  // Details to send
  const router = useRouter();

  const { auth } = useAuth();

  const roomId =
    typeof router.query.roomId === "string" ? router.query.roomId : "";

  const userId = auth?._id;

  const [content, setContent] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);

  // Messages
  const [messages, setMessages] = useState<Message[]>([]);

  // Scroll to bottom
  const messageEnd = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const connectSocket = () => {
    socket = io(BACKEND_URL);
    socket.on("connect", () => console.log(`Connected to ${BACKEND_URL}`));
  };

  // Socket connection when first page load
  useEffect(connectSocket, []);

  // Handle messaging
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

      axios.get(`${BACKEND_URL}/chatroom/${roomId}/users`).then(({ data }) => {
        setUsers(data.map((user: User) => user as User));
      });

      while (!socket) {
        connectSocket();
      } // TODO: Refactor this?

      // On broadcast add message to message list
      socket.on("broadcast", (receivedMessage: any) => {
        if (receivedMessage.roomId === roomId) {
          setMessages(
            messages.concat({
              user: receivedMessage.userId as User,
              roomId: receivedMessage.roomId,
              content: receivedMessage.content,
              createdDate: new Date(receivedMessage.createdDate),
            } as Message)
          );
        }
      });
    }
  }, [messages, roomId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageToSend = {
      roomId: roomId,
      userId: userId,
      content: content,
    };
    setContent("");
    socket.emit("send", messageToSend);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-rose-300 py-3 flex flex-col justify-center">
      {/* <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-3 sm:rounded-2xl"></div> */}
      <div className="relative px-4 bg-white shadow-lg sm:rounded-3xl sm:p-10 ">
        <div className="flex flex-col w-auto ">
          <div className="text-center">
            <div className="flex flex-row">
              <div className="w-11/12">
                <h1 className=" text-gray-900 text-2xl font-semibold">
                  Chat Room
                </h1>
              </div>
              <div className="w-1/12">
                <button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1">
                  Search
                </button>
              </div>
            </div>
            <h1 className=" text-gray-900 text-sm font-semibold w-11/12">
              Room ID: xxxxx
            </h1>
          </div>
          <div className="flex flex-row w-auto ">
            <div className="w-full h-full ">
              <div className="bg-gray-200 shadow-lg sm:rounded-2xl sm:px-5 py-3 space-y-3 overflow-y-auto h-96 mt-1">
                {messages.map((message, idx) => {
                  return (
                    <div key={idx}>
                      <div className="flex flex-row w-auto">
                        <div className=" text-gray-700 text-sm font-semibold">
                          {message.user.name} &lt;
                          {message.user.email}&gt;
                        </div>
                        <div className=" text-gray-400 text-sm font-semibold">
                          {message.createdDate?.toLocaleTimeString("en-GB")}
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-blue-300 rounded-xl">
                        <div className=" text-gray-900 text-sm font-semibold">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="float-left clear-both" ref={messageEnd}></div>
              </div>
              <div className="relative bg-gray-200 shadow-lg sm:rounded-2xl h-1/5 mt-2 p-3">
                <form onSubmit={handleSubmit} className="flex flex-row">
                  <input
                    id="message"
                    name="message"
                    placeholder="Message to send"
                    className="peer w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 mr-10"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                  ></input>
                  <button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 mr-5">
                    Send
                  </button>
                </form>
              </div>
            </div>
            <div className="relative bg-gray-200 sm:rounded-2xl p-5 ml-1">
              <div>
                <h1 className=" text-gray-900 text-xl font-semibold">
                  List of users in chat:
                </h1>
              </div>
              {users.map((user) => {
                return (
                  <div
                    key={user._id}
                    className="flex flex-row bg-gray-300 mt-1 p-2"
                  >
                    {/* <div className="rounded-full bg-pink-300 w-3 h-3 m-2"></div> */}
                    {user.name}&lt;{user.email}&gt;
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatRoom;
