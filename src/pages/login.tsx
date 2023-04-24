import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import axios from './api/axios';
function Login() {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const router = useRouter();
	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.post('/auth/login', { email, password });
		} catch (error) {
			console.log(error)
		}
		return (
			<div className="flex flex-col">
				<div className="flex flex-row relative h-14 bg-gradient-to-r from-sky-300 to-rose-300 shadow-lg items-center ">
					<button onClick={() => router.push("/register")} className="bg-white text-gray-900 rounded-md px-8 py-1 text-xl ml-auto mr-2">
						Register
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
									Login Form
								</h1>
							</div>
							<div className="divide-y divide-gray-200">
								<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
									<div className="relative">
										<input
											autoComplete="off"
											id="email"
											name="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											type="text"
											className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
											placeholder="Email address"
										/>
										<label
											htmlFor="email"
											className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
										>
											Email Address
										</label>
									</div>
									<div className="relative">
										<input
											autoComplete="off"
											id="password"
											name="password"
											type="password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
											placeholder="Password"
										/>
										<label
											htmlFor="password"
											className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
										>
											Password
										</label>
									</div>
									<div className="relative">
										<button className="bg-gradient-to-r from-sky-300 to-rose-300 text-gray-900 rounded-md px-2 py-1">
											Submit
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
}

export default Login;
