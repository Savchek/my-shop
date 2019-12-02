import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

const ListSales = ({ updateScreen }) => {

	const [sales, setSales] = useState([])
	const [loading, setLoading] = useState(true)

	const getCollection = async () => {
		await firebase.updateCollection()
		setSales(firebase.collection.sales)
		setLoading(false)
	}

	useEffect(() => {
		getCollection()
	}, [])


	const editSale = sale => {
		firebase.memorizeSale(sale.date)

		updateScreen('EditSale')
	}

	const renderSales = () => sales.length > 0 ? (
		<ul>
			{
				sales.map(e => (
					<li onClick={() => editSale(e)} key={e.name}>
						<p>Название: {e.name}</p>
						<p>Атрибут: {e.attribute}</p>
						{e.buyPrices.map((p, i) => (
							<p key={p}>Цена закупки: {p}, Количество: {e.buyCounts[i]} шт.</p>
						))}
						<p>Цена продажи: {e.sellPrice}</p>
					</li>
				))
			}
		</ul>
	) : (<div>No sales planned</div>)



	return (
		<div>
			{
				loading ?
					<div className="loader">Loading</div> :
					renderSales()
			}
		</div>
	)
}

export default ListSales