import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

const ListSells = ({ updateScreen }) => {

	const [sells, setSells] = useState([])
	const [loading, setLoading] = useState(true)

	const getCollection = async () => {
		await firebase.updateCollection()
		setSells(firebase.collection.sells)
		setLoading(false)
	}

	useEffect(() => {
		getCollection()
	}, [])


	const editSell = sell => {
		// firebase.memorizeSell(sell.date)

		// updateScreen('EditSell')
	}


	const renderSells = () => sells.length > 0 ? (
		<ul>
			{
				sells.map(e => (
					<li onClick={() => editSell(e)} key={e.id}>

						<p>Title: {e.title}</p>
						<p>Date: {e.date}</p>
						<p>Seller: {e.seller}</p>

						<p>Buyer info:</p>

						<p>Name: {e.buyerInfo.name}</p>
						<p>Address: {e.buyerInfo.address}</p>
						<p>Phone: {e.buyerInfo.phone}</p>

						<p>Sell item info:</p>

						{e.sellItemInfo.purscharePrices.map((p, i) => (
							<p key={i}>Purschare price: {p}, Count: {e.sellItemInfo.sellCounts[i]} шт.</p>
						))}
						<p>Total to sell: {e.sellItemInfo.sellCount}</p>
						<p>Sell price per piece: {e.sellItemInfo.sellPrice}</p>

						<p>Total sell price: {e.sellItemInfo.sellCounts.reduce((t, v) => t + v * e.sellItemInfo.sellPrice, 0)}</p>




					</li>
				))
			}
		</ul>
	) : (<div>No sells planned</div>)



	return (
		<div>
			{
				loading ?
					<div className="loader">Loading</div> :
					renderSells()
			}
		</div>
	)
}

export default ListSells