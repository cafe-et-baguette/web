import { useAuth } from "@/context/AuthContext";
import { User, userFromId } from "@/utils/auth.services";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, React } from "react";
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

  // Messages
  const [messages, setMessages] = useState<Message[]>([]);

  const connectSocket = () => {
    socket = io(BACKEND_URL);
    socket.on("connect", () => console.log(`Connected to ${BACKEND_URL}`));
  };

  useEffect(connectSocket, []);

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

      while (!socket) {
        connectSocket();
      } // TODO: Refactor this?

      // On broadcast add message to message list
      socket.on("broadcast", (receivedMessage: any) => {
        if (receivedMessage.roomId === roomId) {
          setMessages(
            messages.concat({
              user: receivedMessage.user as User,
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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-2xl"></div> */}
        <div className="text-center">
          <h1 className=" text-gray-900 text-2xl font-semibold">Chat Room</h1>
          <h1 className=" text-gray-900 text-sm font-semibold">Room ID</h1>
        </div>
        <div className="flex flex-row">
          <div>
            <div className="relative bg-gray-100 shadow-lg sm:rounded-2xl sm:p-20 space-y-3">
              {messages.map((message, idx) => {
                return (
                  <div key={idx} className="px-4 py-2 bg-gray-300 rounded-xl ">
                    <div className=" text-gray-900 text-sm font-semibold">
                      From: {message.user.name} &lt;
                      {message.user.email}&gt;
                    </div>
                    <div className=" text-gray-900 text-sm font-semibold">
                      Message: {message.content}
                    </div>
                    <div className=" text-gray-900 text-sm font-semibold">
                      Time: {message.createdDate?.toISOString()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative bg-gray-100 shadow-lg sm:rounded-2xl sm:p-20">
              <form onSubmit={handleSubmit}>
                <input
                  id="message"
                  name="message"
                  placeholder="Message to send"
                  className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                ></input>
                <button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-2 py-1">
                  Send
                </button>
              </form>
            </div>
          </div>
          <div className="relative bg-gray-100 sm:rounded-2xl sm:p-20 ml-1">
            <h1> ABC </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatRoom;
