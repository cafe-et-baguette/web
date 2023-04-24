import router from "next/router";
import { SyntheticEvent, useState } from "react";
import axios from "./api/axios";
import { useAuth } from "@/context/AuthContext";

function Create() {
  const { auth } = useAuth();
  const handleLogout = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/logout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [emails, setEmails] = useState<string[]>([]);

  const handleAddEmailButton = () => {
    if (emails.includes(currentEmail.trim()) || currentEmail === auth?.email) {
      setCurrentEmail("");
      return;
    }
    setEmails(emails.concat(currentEmail.trim()));
    setCurrentEmail("");
  };

  const handleCreateButton = async () => {
    try {
      const res = await axios.post("/chatroom/create", {
        name,
        emails,
      });
      router.push(`/join`);
    } catch (error) {
      console.log(error);
    }
    setCurrentEmail("");
    setName("");
    setEmails([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row relative h-14 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg items-center ">
        <button
          className="bg-white text-gray-900 rounded-md px-8 py-1 ml-auto text-xl mr-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto mt-36">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className=" text-gray-900 text-2xl font-semibold">
                Create room
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    name="room"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Room name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Room name
                  </label>
                </div>

                <div className="relative">
                  <input
                    name="invite"
                    placeholder="User email to invite"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                  />
                  <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    User email to invite
                  </label>
                  <button
                    className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-2 py-1 mt-2 w-28"
                    onClick={handleAddEmailButton}
                  >
                    Add Email
                  </button>
                  <div className="flex flex-auto">
                    {emails.map((email) => {
                      return (
                        <div
                          key={email}
                          className="bg-gray-200 text-gray-900 rounded-md px-2 py-1 mr-1 mt-1 w-fit text-base"
                        >
                          {email}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative">
                  <div className="flex flex-row">
                    <button
                      className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-2 py-1 w-36"
                      onClick={() => router.back()}
                    >
                      Back
                    </button>

                    <button
                      className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-2 py-1 ml-auto w-36"
                      onClick={handleCreateButton}
                    >
                      Create
                    </button>
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
export default Create;
