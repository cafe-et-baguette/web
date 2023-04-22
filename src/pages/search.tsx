import { useRouter } from "next/router";
function Search() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-rose-300 py-3 flex flex-col justify-center">
      <div className="relative px-4 bg-white shadow-lg sm:rounded-3xl sm:p-10 ">
        <div className="text-center">
          <div className="flex flex-row w-1/2">
            <button onClick={() => router.back()} className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-10 py-1 ml-5 ">
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
              />
              <button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-5 ">
                Search
              </button>
            </div>
            <div className="relative bg-gray-200 shadow-lg sm:rounded-2xl h-96 mt-2 p-3 overflow-auto">
              <div>
                <div className="flex flex-row w-auto">
                  <div className=" text-gray-700 text-sm font-semibold">
                    from
                  </div>
                </div>
                <div className="px-4 py-3 bg-blue-200  rounded-xl flex flex-row w-auto">
                  <div className=" text-gray-900 text-sm font-semibold">
                    message
                  </div>
                  <div className=" text-gray-400 text-sm font-semibold ml-auto">
                    time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Search;
