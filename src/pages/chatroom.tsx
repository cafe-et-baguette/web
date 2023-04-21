import axios from "axios";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "";

let socket: Socket;
export type Message = {
  userId: string;
  roomId: string;
  content: string;
  createdDate?: Date;
};

const ChatRoom = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [recvMsg, setRecvMsg] = useState<Message[]>([]);
  const connectSocket = () => {
    socket = io(BACKEND_URL);
    socket.on("connect", () => console.log(`Connected to ${BACKEND_URL}`));
  };

  useEffect(connectSocket, []);

  useEffect(() => {
    if (roomId) {
      axios.get(`${BACKEND_URL}/chatroom/${roomId}/messages`).then((res) => {
        const previousMessages = res.data;
        setRecvMsg(
          previousMessages.map((previousMessage: any) => {
            previousMessage.createdDate = new Date(previousMessage.createdDate);
            return previousMessage as Message;
          })
        );
      });

      while (!socket) {
        connectSocket();
      }

      socket.on("broadcast", (msg: any) => {
        msg.createdDate = new Date(msg.createdDate);
        if (msg.roomId === roomId) {
          setRecvMsg(recvMsg.concat(msg as Message));
        }
      });
    }
  }, [recvMsg, roomId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageToSend: Message = {
      roomId: roomId,
      userId: userId,
      content: message,
    };
    socket.emit("send", messageToSend);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div>
          <h1 className=" text-gray-900 text-2xl font-semibold">Chat Room</h1>
        </div>
        <div>
          {recvMsg.map((msg, idx) => {
            return (
              <div key={idx}>
                <div>From: {msg.userId}</div>
                <div>Message: {msg.content}</div>
                <div>Time: {msg.createdDate?.toISOString()}</div>
                <div>----</div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            id="roomId"
            name="roomId"
            placeholder="Room ID"
            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          ></input>
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
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
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
