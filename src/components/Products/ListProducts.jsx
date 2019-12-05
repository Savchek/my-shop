import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

const ListProducts = ({ chooseProduct, title }) => {

	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	const getCollection = async () => {
		await firebase.updateCollection()
		setProducts(firebase.collection.products)
		setLoading(false)
	}

	useEffect(() => {
		getCollection()
	}, [])


	const renderProducts = () => (
		<div>
			<h1>{title}</h1>
			{products.length > 0 ?
				(<ul>
					{
						products.map(e => (
							<li onClick={() => chooseProduct(e)} key={e.id}>
								<p>Название: {e.name}</p>
								<p>Атрибут: {e.attribute}</p>
								{e.purscharePrices.map((p, i) => (
									<p key={i}>Цена закупки: {p}, Количество: {e.purschareCounts[i]} шт.</p>
								))}
								<p>Total count: {e.purschareCounts.reduce((t, v) => t + parseInt(v), 0)}</p>
								<p>Цена продажи: {e.sellPrice}</p>
								<p>Planned to sale: {e.sellCount}</p>
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
					renderProducts()
			}
		</div>
	)
}

export default ListProducts