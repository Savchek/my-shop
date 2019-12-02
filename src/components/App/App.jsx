import React, { useState, useEffect } from 'react'
import firebase from '../firebase'
import Login from '../Login/Login'
import MainScreen from '../MainScreen/MainScreen'
import NavPanel from '../NavPanel/NavPanel'
import AddGood from '../Goods/AddGood'
import EditGood from '../Goods/EditGood'
import PurschareGood from '../Goods/PurschareGood'

const App = () => {
	const [firebaseInitialized, setFirebaseInitialized] = useState(false)
	const [screen, setScreen] = useState('')

	const initFirebase = async () => {
		const res = await firebase.isInitialized()
		setFirebaseInitialized(res)

		// if user authorized
		if (firebase.auth.currentUser) {
			firebase.updateCollection()
			setScreen('Main')
		} else {
			setScreen('Login')
		}
	}

	useEffect(() => {
		initFirebase()
	}, [])

	const screenSwitcher = () => {
		switch (screen) {
		case 'Login':
			return <Login updateScreen={setScreen} />
		case 'Main':
			return <MainScreen updateScreen={setScreen} />
		case 'AddGood':
			return <AddGood updateScreen={setScreen} />
		case 'EditGood':
			return <EditGood />
		case 'PurschareGood':
			return <PurschareGood updateScreen={setScreen} />
		default:
			return <div>Screen switcher error</div>
		}
	}


	return (
		<div>
			{firebaseInitialized !== false ? (<div>
				{screenSwitcher()}
				{screen != 'Login' && <NavPanel screen={screen} updateScreen={setScreen} />}

			</div>) : <div className="loader">Loading</div>}
		</div>
	)

}

export default App
