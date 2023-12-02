import React, { useState, FormEvent, useEffect } from 'react';
import { useErrors } from '../../hooks';
import Errors from '../../components/Errors';
import { getStoredToken, isLoggedIn, login, storeToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';



const Login: React.FC = () => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const {errors, setErrors, useClearErrorsEffect} = useErrors();
	const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const token = await login(username, password, setErrors)		

		if (!token){
			return
		} else{
			storeToken(token)
			navigate('/games')
		}

	};

	useEffect(()=>{
		if(isLoggedIn()){
			navigate('/games')
		}
	}, [])

	useClearErrorsEffect(username, password)

	return (
		<div className='flex-center flex-col'>
			<h1>Login</h1>
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
				<button type="submit">Login</button>
			</form>
			<Errors errors={errors}/>
		</div>
	);
};

export default Login;
