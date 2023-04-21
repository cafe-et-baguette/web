import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/pages/api/axios';

interface AuthContextState {
	auth: {
		_id: string;
		username: string;
		email: string;
	} | null;
	setAuth: (
		auth: {
			_id: string;
			username: string;
			email: string;
		} | null
	) => void;
}

const AuthContext = createContext<AuthContextState | null>(null);
AuthContext.displayName = 'AuthContext';

function AuthContextProvider({ children }: { children: React.ReactNode }) {
	const [auth, setAuth] = useState<{
		_id: string;
		username: string;
		email: string;
	} | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get('/auth/user');

				const data = response.data;
				setAuth({
					_id: data._id,
					username: data.username,
					email: data.email,
				});
				console.log(data);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth(): AuthContextState {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthContextProvider');
	}
	return context;
}

export { AuthContextProvider, useAuth };
