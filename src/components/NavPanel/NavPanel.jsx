import React from 'react'
import firebase from '../firebase'

const NavPanel = ({ screen, updateScreen }) => {

	const logout = async () => {
		await firebase.logout()
		updateScreen('Login')
	}

	return (
		<div>
			<button
				disabled={screen === 'Main'}
				onClick={() => updateScreen('Main')}
				style={{ border: screen === 'Main' ? '2px solid black' : 'none' }}
			>Главная</button>

			<button
				disabled
				onClick={() => updateScreen('')}
			>Продажи</button>

			<button
				disabled
				onClick={() => updateScreen('')}
			>Сделка</button>

			<button
				disabled={screen === 'PurschareGood'}
				onClick={() => updateScreen('PurschareGood')}
				style={{ border: screen === 'PurschareGood' ? '2px solid black' : 'none' }}
			>Приход товара</button>

			<button
				disabled={screen === 'AddGood'}
				onClick={() => updateScreen('AddGood')}
				style={{ border: screen === 'AddGood' ? '2px solid black' : 'none' }}
			>Добавить товар</button>

			<button
				disabled
				onClick={() => updateScreen('')}
			>Наличие</button>

			<button
				disabled={screen === 'EditGood'}
				onClick={() => updateScreen('EditGood')}
				style={{ border: screen === 'EditGood' ? '2px solid black' : 'none' }}
			>Склад</button>


			<button
				onClick={logout}
			>Logout</button>

		</div>
	)
}

export default NavPanel