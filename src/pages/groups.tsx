import { SyntheticEvent, useEffect, useState } from 'react';
import axios from './api/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

interface ChatRoom {
	_id: string;
	name: string;
	userIds: string[];
	messages: any[]; // update this with the type for your messages
}

function Groups() {
	const { auth, setAuth } = useAuth();
	const router = useRouter();

	const handleLogout = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post('/auth/logout');
			router.push('/login');
		} catch (error) {
			console.log(error);
		}
	};

	const [chatRooms, setChatRooms] = useState<ChatRoom[]>();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get('/auth/user');

				const data = response.data;
				setAuth({
					_id: data._id,
					name: data.name,
					email: data.email,
				});
				console.log(data);
			} catch (error) {
				router.push('/login');
				console.error(error);
			}
		};
		fetchUser();
	}, [router, setAuth]);

	useEffect(() => {
		if (!auth) {
			return;
		}
		const fetchChats = async () => {
			try {
				const res = await axios.get('/chatroom/my');
				setChatRooms(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchChats();
	}, [auth]);

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
			<div className="flex flex-row w-auto mt-32 mb-32 ">
				<div className="w-full h-full m-4">
					<div className="bg-gray-200 sm:rounded-2xl sm:px-5 py-3 h-96 divide-y-2 divide-gray-400">
						<div>
							<div className="text-center">
								<div className="flex flex-row w-1/2 mb-2">
									<button
										onClick={() => router.back()}
										className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-10 py-1 ml-5 "
									>
										Back
									</button>
									<h1 className=" text-gray-900 text-2xl font-semibold ml-auto">
										My Chats
									</h1>
								</div>
							</div>
						</div>
						<div className="h-80 overflow-y-auto">
							{chatRooms &&
								chatRooms.map((chatRoom) => (
									<>
										<div className="flex flex-row items-center bg-white sm:px-5 py-3 space-y-3 m-1">
											{chatRoom.name}
											<button
												key={chatRoom._id}
												onClick={() =>
													router.push(
														`/chatroom/${chatRoom._id}`
													)
												}
												className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 ml-auto"
											>
												Chat &gt;
											</button>
										</div>
									</>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Groups;
