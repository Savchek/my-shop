import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

const ListSells = ({ dateFilter }) => {

	const [sells, setSells] = useState([])
	const [loading, setLoading] = useState(true)

	const filterSells = () => {
		console.log('REfilter')
		setSells(sells => sells.filter(s => {
			let sellDate = new Date(s.date)
			return (
				sellDate.getDay() === dateFilter.getDay() &&
				sellDate.getMonth() === dateFilter.getMonth() &&
				sellDate.getYear() === dateFilter.getYear()
			)
		}))
	}

	const getCollection = async () => {
		await firebase.updateCollection()
		setSells(firebase.collection.sells)
		if (dateFilter) filterSells()
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


						{
							e.sellItemsInfo.map((item, index) => (

								<div key={item.id}>
									<h5>Item # {index + 1}</h5>
									<p>Selling {item.sellCount} pieces for {item.sellPrice}$ each: </p>

									{
										item.purscharePrices.map((p, i) => (
											<p key={i}>Purschare price: {p}, Count: {item.sellCounts[i]} шт.</p>
										))
									}

								</div>

							))
						}


						{/* <p> Total sell price: {e.sellItemsInfo.reduce((total, item) => item.sellCounts.reduce((t, v) => t + v * e.sellItemsInfo.sellPrice, 0), 0)}</p> */}





					</li>
				))
			}
		</ul >
	) : (<div>No sells yet</div>)



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