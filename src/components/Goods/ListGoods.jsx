import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

const ListGoods = ({ chooseGood, title }) => {

	const [goods, setGoods] = useState([])
	const [loading, setLoading] = useState(true)

	const getCollection = async () => {
		await firebase.updateCollection()
		setGoods(firebase.collection.goods)
		setLoading(false)
	}

	useEffect(() => {
		getCollection()
	}, [])


	const renderGoods = () => (
		<div>
			<h1>{title}</h1>
			{goods.length > 0 ?
				(<ul>
					{
						goods.map(e => (
							<li onClick={() => chooseGood(e)} key={e.id}>
								<p>Название: {e.name}</p>
								<p>Атрибут: {e.attribute}</p>
								{e.buyPrices.map((p, i) => (
									<p key={p}>Цена закупки: {p}, Количество: {e.buyCounts[i]} шт.</p>
								))}
								<p>Цена продажи: {e.sellPrice}</p>
							</li>
						))
					}
				</ul>) :
				<div>Товаров пока нет</div>
			}
		</div>
	)



	return (
		<div>
			{
				loading ?
					<div className="loader">Loading</div> :
					renderGoods()
			}
		</div>
	)
}

export default ListGoods