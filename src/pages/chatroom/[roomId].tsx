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

	useEffect(() => {
		if (auth) {
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
									createdDate: new Date(
										receivedMessage.createdDate
									),
								},
							]);
						});
					}
				});
				setSocket(newSocket);
			};
			connectSocket();
		}
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
								{messages.map((message, idx) => {
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
								})}
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
							{users.map((user) => {
								return (
									<div
										key={user._id}
										className="flex flex-row bg-gray-300 mt-1 p-2"
									>
										{user.name}&lt;{user.email}&gt;
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ChatRoom;
