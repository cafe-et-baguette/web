import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import axios from './api/axios';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get('/auth/user');

				const data = response.data;

				console.log(data);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	return <div>Home</div>;
}
