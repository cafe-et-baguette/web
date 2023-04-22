function Groups() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row relative h-14 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg items-center ">
        <button className="bg-white text-gray-900 rounded-md px-8 py-1 ml-auto text-xl mr-2">
          Logout
        </button>
      </div>
      <div className="flex flex-row w-auto mt-32 mb-32 ">
        <div className="w-full h-full m-4">
          <div className="bg-gray-200 sm:rounded-2xl sm:px-5 py-3 h-96 divide-y-2 divide-gray-400">
            <div>
              <div className="text-center">
                <h1 className=" text-gray-900 text-2xl font-semibold">
                  My Chats
                </h1>
              </div>
            </div>
            <div className="h-80 overflow-y-auto">
              <div className="flex flex-row items-center bg-white sm:px-5 py-3 space-y-3 m-1">
                Name 1
                <button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-auto">
                  Chat &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Groups;
