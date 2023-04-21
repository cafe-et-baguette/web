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
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-2xl"></div>

        <div className="text-center align-top">
          <h1 className=" text-gray-900 text-2xl font-semibold">Chat Room</h1>
          <h1 className=" text-gray-900 text-sm font-semibold">Room ID</h1>
        </div>
        <div className="flex flex-row">
          <div>
            <div className="relative bg-gray-100 shadow-lg sm:rounded-2xl sm:p-20 space-y-3">
              <div className="px-4 py-2 bg-gray-300 rounded-xl">
                <h1 className=" text-gray-900 text-sm font-semibold">
                  User ID
                </h1>
                <h1 className=" text-gray-900 text-xl font-semibold">
                  Message
                </h1>
              </div>
              <div className="px-4 py-2 bg-gray-300 rounded-xl">
                <h1 className=" text-gray-900 text-sm font-semibold">
                  User ID
                </h1>
                <h1 className=" text-gray-900 text-xl font-semibold">
                  Message
                </h1>
              </div>
              <div className="px-4 py-2 bg-gray-300 rounded-xl">
                <h1 className=" text-gray-900 text-sm font-semibold">
                  User ID
                </h1>
                <h1 className=" text-gray-900 text-xl font-semibold">
                  Message
                </h1>
              </div>
            </div>
            <div className="relative bg-gray-100 shadow-lg sm:rounded-2xl sm:p-20">
              <form
                onSubmit={handleSubmit}
                // className="relative px-4 py-10 bg-white shadow-lg sm:rounded-2xl sm:p-20"
              >
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
          <div className="relative bg-gray-100 sm:rounded-2xl sm:p-20 ml-1">
            <h1> ABC </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatRoom;
