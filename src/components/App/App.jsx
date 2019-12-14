import React, { useState, useEffect } from 'react'
import firebase from '../firebase'
import Login from '../Login/Login'
import MainScreen from '../MainScreen/MainScreen'
import NavPanel from '../NavPanel/NavPanel'
import AddProduct from '../Products/AddProduct'
import EditProduct from '../Products/EditProduct'
import PurschareProduct from '../Products/PurschareProduct'
import AddSell from '../Sells/AddSell'
import ListSells from '../Sells/ListSells'

const App = () => {
	const [firebaseInitialized, setFirebaseInitialized] = useState(false)
	const [screen, setScreen] = useState('')
	const [productsFilter, setProductsFilter] = useState([])
	const [sellsFilter, setSellsFilter] = useState([])

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
		case 'AddProduct':
			return <AddProduct updateScreen={setScreen} />
		case 'EditProduct':
			return <EditProduct filter={productsFilter} />
		case 'PurschareProduct':
			return <PurschareProduct updateScreen={setScreen} />
		case 'AddSell':
			return <AddSell updateScreen={setScreen} />
		case 'ListSells':
			return <ListSells updateScreen={setScreen} filter={sellsFilter} setFilter={setSellsFilter} />
		default:
			return <div>Screen switcher error</div>
		}
	}


	return (
		<div>
			{firebaseInitialized !== false ? (<div>
				{screenSwitcher()}

				{
					screen !== 'Login' &&
					<NavPanel screen={screen} updateScreen={setScreen} productsFilter={productsFilter} setProductsFilter={setProductsFilter} />
				}

			</div>) : <div className="loader">Loading</div>}
		</div>
	)

}

export default App
