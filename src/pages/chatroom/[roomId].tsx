import { User, userFromId } from "@/utils/auth.services";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const roomId =
    typeof router.query.roomId === "string" ? router.query.roomId : "";

  const [userId, setUserId] = useState<string>(""); // TODO: Infer user from session
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
        <div>
          <h1 className=" text-gray-900 text-2xl font-semibold">Chat Room</h1>
        </div>
        <div>
          {messages.map((message, idx) => {
            return (
              <div key={idx}>
                <div>
                  From: {message.user.name} &lt;{message.user.email}&gt;
                </div>
                <div>Message: {message.content}</div>
                <div>Time: {message.createdDate?.toISOString()}</div>
                <div>----</div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            id="userId"
            name="userId"
            placeholder="User ID"
            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          ></input>
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
  );
};
export default ChatRoom;
