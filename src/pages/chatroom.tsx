const ChatRoom = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formTarget = e.target as typeof e.target & {
      roomId: { value: string };
      userId: { value: string };
      message: { value: string };
    };
    console.log(formTarget.message.value);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div>
          <h1 className=" text-gray-900 text-2xl font-semibold">Chat Room</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            id="roomId"
            name="roomId"
            placeholder="Room ID"
            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
          ></input>
          <input
            id="userId"
            name="userId"
            placeholder="User ID"
            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
          ></input>
          <input
            id="message"
            name="message"
            placeholder="Message to send"
            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
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
