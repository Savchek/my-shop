import React, { useState } from 'react'
import firebase from '../firebase'

const Login = ({ updateScreen }) => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const login = async () => {
		try {
			await firebase.login(email, password)
			updateScreen('Main')
		} catch (error) {
			alert(error.message)
		}
	}

	const register = async () => {
		try {
			await firebase.register(email, password)
			updateScreen('Main')
		} catch (error) {
			alert(error.message)
		}
	}

	return (
		<div>
			<h1>Login or register</h1>
			<form onSubmit={e => e.preventDefault() && false}>
				<label>Email Address</label>
				<input id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
				<label>Password</label>
				<input name="password" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />

				<button onClick={login}>Login</button>
				<button onClick={register}>Register</button>
			</form>
		</div>
	)
}

export default Login