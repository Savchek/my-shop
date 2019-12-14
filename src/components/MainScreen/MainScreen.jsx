import React, { useState } from 'react'
import ListSells from '../Sells/ListSells'

const MainScreen = ({ updateScreen }) => {

	const date = new Date()

	return (
		<div>
			<h1>Todays sells</h1>
			<ListSells dateFilter={date} />
		</div>
	)

}

export default MainScreen