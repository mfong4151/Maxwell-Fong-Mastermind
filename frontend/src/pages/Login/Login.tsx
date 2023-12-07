import React, { useState, FormEvent, useEffect } from 'react';
import { useErrors } from '../../hooks';
import Errors from '../../components/Errors';
import { getStoredToken, isLoggedIn, jwtFetch, login, storeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../utils';



const Login: React.FC = () => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [toggleForm, setToggleForm] = useState<string>('login')
	const { errors, setErrors, useClearErrorsEffect } = useErrors();
	const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			if (toggleForm === 'signup'){
				const body = {username, password}
				const res = await jwtFetch(`${SERVER_URL}/api/v1/auth/signup`, body, 'POST')
				const data = await res.json();
				
				if (!res.ok){
					setErrors(data.errors)
					return
				}

			}
			const token = await login(username, password, setErrors)

			if (!token) {
				return
			} else {
				storeToken(token)
				navigate('/games')
			}

		} catch (error) {

		}
	};
	const handleSwapForm = (e: any): void => {
		if (toggleForm === 'login') {
			setToggleForm('signup')

		} else {
			setToggleForm('login')
		}

	}

	useEffect(() => {
		if (isLoggedIn()) {
			navigate('/games')
		}
	}, [])

	useClearErrorsEffect(username, password, toggleForm)

	return (
		<div className='flex-center flex-col'>
			<h1>{toggleForm === 'login' ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username: </label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password">Password: </label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">{toggleForm === 'login' ? 'Log in': 'Sign up'}</button>
			</form>
			<button onClick={handleSwapForm}>
				Swap to {toggleForm === 'login' ? 'Sign Up' : 'Log in'}
			</button>
			<Errors errors={errors} />
		</div>
	);
};

export default Login;
