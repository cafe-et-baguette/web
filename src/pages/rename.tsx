import { useAuth } from '@/context/AuthContext';
import axios from './api/axios';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';

function Rename() {
	const { auth, setAuth } = useAuth();
	const router = useRouter();
	const [newName, setNewName] = useState('');

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			if (!auth) {
				return;
			}
			const res = await axios.post(`/auth/rename/${auth._id}`, {
				name: newName,
			});
			console.log(res);
			setAuth({ _id: auth._id, name: newName, email: auth.email });

			router.push('/join');
		} catch (error) {
			console.log(error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewName(e.target.value);
	};

	const handleLogout = async (e: SyntheticEvent) => {
		e.preventDefault();

		try {
			const res = await axios.post('/auth/logout');
			console.log(res);
		} catch (error) {
			console.log(error);
		}

		setAuth(null);
		router.push('/login');
	};

	return (
		<div className="flex flex-col">
			<div className="flex flex-row relative h-14 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg items-center ">
				<button
					onClick={handleLogout}
					className="bg-white text-gray-900 rounded-md px-8 py-1 ml-auto text-xl mr-2"
				>
					Logout
				</button>
			</div>
			<div className="relative py-3 sm:max-w-xl sm:mx-auto mt-36">
				<div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
				<form
					onSubmit={handleSubmit}
					className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
				>
					<div className="max-w-md mx-auto">
						<div>
							<h1 className=" text-gray-900 text-2xl font-semibold">
								Rename
							</h1>
						</div>
						<div className="divide-y divide-gray-200">
							<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
								<div className="relative">
									<input
										id="rename"
										name="rename"
										value={newName}
										onChange={handleInputChange}
										className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
										placeholder={auth?.name}
									/>
									<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
										Rename
									</label>
								</div>

								<div className="relative">
									<button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-2 py-1">
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Rename;
