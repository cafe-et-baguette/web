import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';

function Join() {
	const router = useRouter();
	const { auth, setAuth } = useAuth();

	return (
		<div className="flex flex-col ">
			<div className="flex flex-row relative h-14 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg items-center ">
				<h1 className="text-gray-900 text-2xl font-semibold p-2">
					{auth?.name}
				</h1>
				<button className=" text-gray-600 rounded-md ml-1 text-base">
					Edit
				</button>
				<button className="bg-white text-gray-900 rounded-md px-8 py-1 text-xl ml-auto mr-3">
					My Chats
				</button>
				<button className="bg-white text-gray-900 rounded-md px-8 py-1 text-xl mr-2">
					Logout
				</button>
			</div>
			<div className="flex flex-row w-auto mt-32 mb-32">
				<div className="w-full h-full m-4">
					<div className="bg-gray-200 sm:rounded-2xl sm:px-5 py-3 h-96 divide-y-2 divide-gray-400">
						<div>
							<div className="text-center">
								<h1 className=" text-gray-900 text-2xl font-semibold">
									Groups
								</h1>
							</div>
						</div>
						<div className="h-80 overflow-y-auto">
							<div className="flex flex-row items-center bg-white sm:px-5 py-3 space-y-3 m-1">
								Group 1
								<button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-auto">
									Join
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full h-full m-4">
					<div className="bg-gray-200 sm:rounded-2xl sm:px-5 py-3 h-96 divide-y-2 divide-gray-400">
						<div>
							<div className="text-center">
								<h1 className=" text-gray-900 text-2xl font-semibold">
									Chats
								</h1>
							</div>
						</div>
						<div className="h-80 overflow-y-auto">
							<div className="flex flex-row items-center bg-white sm:px-5 py-3 space-y-3 m-1">
								Chat 1
								<button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-auto">
									Join
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Join;
