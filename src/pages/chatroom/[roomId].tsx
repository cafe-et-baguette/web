import { useAuth } from '@/context/AuthContext';
import { User, userFromId } from '@/utils/auth.services';
import axios from '../api/axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: '';

let socket: Socket;
export type Message = {
	user: User;
	roomId: string;
	content: string;
	createdDate?: Date;
};

interface ChatRoom {
	_id: string;
	name: string;
	userIds: string[];
	messages: any[]; // update this with the type for your messages
}

const ChatRoom = () => {
	// Details to send

	const router = useRouter();
	const { auth, setAuth } = useAuth();
	const roomId =
		typeof router.query.roomId === 'string' ? router.query.roomId : '';
	const userId = auth?._id;
	const [content, setContent] = useState<string>('');
	const [room, setRoom] = useState<ChatRoom>();
	const [users, setUsers] = useState<User[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [socket, setSocket] = useState<Socket<
		DefaultEventsMap,
		DefaultEventsMap
	> | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Scroll to bottom
	const messageEnd = useRef<null | HTMLDivElement>(null);

	const scrollToBottom = () => {
		messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
	};
	useEffect(scrollToBottom, [messages]);

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
			} catch (error) {
				router.push('/login');
				console.error(error);
			}
		};
		fetchUser();
	}, [router, setAuth]);

	const connectSocket = () => {
		const newSocket = io(BACKEND_URL);
		newSocket.on('connect', () =>
			console.log(`Connected to ${BACKEND_URL}`)
		);
		newSocket.on('broadcast', (receivedMessage: any) => {
			if (receivedMessage.roomId === roomId) {
				userFromId(receivedMessage.userId).then((user) => {
					setMessages((previousMessages) => [
						...previousMessages,
						{
							user,
							roomId: receivedMessage.roomId,
							content: receivedMessage.content,
							createdDate: new Date(receivedMessage.createdDate),
						},
					]);
				});
			}
		});
		return newSocket;
	};

	useEffect(() => {
		let newSocket: any;
		if (auth) {
			newSocket = connectSocket();
			setSocket(newSocket);
		}

		return () => {
			newSocket?.off('broadcast');
			newSocket?.off('connect');
			newSocket?.disconnect();
		};
	}, [auth, roomId]);

	useEffect(() => {
		if (roomId) {
			axios.get(`/chatroom/id/${roomId}`).then(({ data }) => {
				setRoom(data as ChatRoom);
			});
			axios.get(`/chatroom/${roomId}/users`).then(({ data }) => {
				setUsers(data as User[]);
			});
			axios.get(`/chatroom/${roomId}/messages`).then(async ({ data }) => {
				const previousMessages = await Promise.all(
					data.map(async (messageResponse: any) => {
						const user = await userFromId(messageResponse.userId);
						return {
							user,
							roomId: messageResponse.roomId,
							content: messageResponse.content,
							createdDate: new Date(messageResponse.createdDate),
						} as Message;
					})
				);
				setLoading(false);
				setMessages(previousMessages);
			});
		}
	}, [roomId]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (socket) {
			const messageToSend = {
				roomId: roomId,
				userId: userId,
				content: content,
			};
			setContent('');
			socket.emit('send', messageToSend);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-sky-300 to-rose-300 py-3 flex flex-col justify-center">
			<div className="relative px-4 bg-white shadow-lg sm:rounded-3xl sm:p-10 ">
				<div className="flex flex-col w-auto">
					<div className="text-center">
						<div className="flex flex-row ">
							<div className="w-1/12">
								<button
									className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1"
									onClick={() => router.back()}
								>
									Back
								</button>
							</div>
							<div className="w-10/12 ">
								<h1 className=" text-gray-900 text-2xl font-semibold">
									{room?.name}
								</h1>
							</div>
							<div className="w-1/12">
								<button
									onClick={() => {
										router.push(`/search/${roomId}`);
									}}
									className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1"
								>
									Search
								</button>
							</div>
						</div>
					</div>
					<div className="flex flex-row w-auto">
						<div className="w-full h-full">
							<div className="bg-gray-200 shadow-lg sm:rounded-2xl sm:pl-5 py-3 pr-8 space-y-3 overflow-y-auto h-96 mt-1 w-auto">
								{loading ? (
									<div className="w-full h-full flex flex-col justify-center items-center">
										<div role="status">
											<svg
												aria-hidden="true"
												className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
											<span className="sr-only">
												Loading...
											</span>
										</div>
									</div>
								) : (
									messages.map((message, idx) => {
										return (
											<div key={idx}>
												<div className="flex flex-row w-auto">
													<div className=" text-gray-700 text-sm font-semibold">
														{message.user.name} &lt;
														{message.user.email}&gt;
													</div>
												</div>
												<div className="px-4 py-3 bg-blue-200  rounded-xl flex flex-row w-full">
													<div className=" break-all text-gray-900 text-sm font-semibold ">
														{message.content}
													</div>
													<div className=" text-gray-400 text-sm font-semibold ml-auto mt-auto">
														{message.createdDate?.toLocaleTimeString(
															'en-GB'
														)}
													</div>
												</div>
											</div>
										);
									})
								)}
								<div
									className="float-left clear-both"
									ref={messageEnd}
								></div>
							</div>
							<div className="relative bg-gray-200 shadow-lg sm:rounded-2xl h-1/5 mt-2 p-3">
								<form
									onSubmit={handleSubmit}
									className="flex flex-row"
								>
									<input
										id="message"
										name="message"
										placeholder="Message to send"
										className="peer w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 mr-10"
										value={content}
										onChange={(e) => {
											setContent(e.target.value);
										}}
									></input>
									<button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-8 py-1 mr-5">
										Send
									</button>
								</form>
							</div>
						</div>
						<div className="relative bg-gray-200 sm:rounded-2xl p-5 ml-3">
							<div>
								<h1 className=" text-gray-900 text-xl font-semibold">
									List of users in chat:
								</h1>
							</div>
							{loading ? (
								<div className="w-full h-3/4 flex flex-col justify-center items-center">
									<div role="status">
										<svg
											aria-hidden="true"
											className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
										<span className="sr-only">
											Loading...
										</span>
									</div>
								</div>
							) : (
								users.map((user) => {
									return (
										<div
											key={user._id}
											className="flex flex-row bg-gray-300 mt-1 p-2"
										>
											{user.name}&lt;{user.email}&gt;
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ChatRoom;
