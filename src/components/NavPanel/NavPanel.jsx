import React from 'react'
import firebase from '../firebase'

const NavPanel = ({ screen, updateScreen, productsFilter, setProductsFilter }) => {

	const logout = async () => {
		await firebase.logout()
		updateScreen('Login')
	}

	return (
		<div>
			<button
				disabled={screen === 'Main'}
				onClick={() => updateScreen('Main')}
			>Главная</button>

			<button
				disabled={screen === 'ListSells'}
				onClick={() => updateScreen('ListSells')}
			>Продажи</button>

			<button
				disabled={screen === 'AddSell'}
				onClick={() => updateScreen('AddSell')}
			>Сделка</button>

			<button
				disabled={screen === 'PurschareProduct'}
				onClick={() => updateScreen('PurschareProduct')}
			>Приход товара</button>

			<button
				disabled={screen === 'AddProduct'}
				onClick={() => updateScreen('AddProduct')}
			>Добавить товар</button>

			<button
				disabled={screen === 'EditProduct' && productsFilter.includes('available')}
				onClick={() => {
					setProductsFilter('available')
					updateScreen('EditProduct')
				}}
			>Наличие</button>

			<button
				disabled={screen === 'EditProduct' && productsFilter.length === 0}
				onClick={() => {
					setProductsFilter('all')
					updateScreen('EditProduct')
				}}
			>Склад</button>


			<button
				onClick={logout}
			>Logout</button>

		</div>
	)
}

export default NavPanel