import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

const ListProducts = ({ chooseProduct, title, filter, specific }) => {

	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)




	useEffect(() => {
		const getCollection = async () => {
			setLoading(true)
			console.log('rerendered')
			await firebase.updateCollection()

			let prods = [...firebase.collection.products]

			if (filter.length > 0) {
				if (filter.includes('available')) {
					console.log('all available')
					prods = prods.filter(e => {
						let purschareTotalCount = e.purschareCounts.reduce((v, i) => v += parseInt(i), 0)
						let sellTotalCount = e.sellCounts.reduce((v, i) => v += parseInt(i), 0)
						return (purschareTotalCount > sellTotalCount)
					})
				}
				if (filter.includes('no-specific')) {
					console.log('no-specific')
					console.log(specific)
					prods = prods.filter(e => {
						console.log(e.id)
						return (!specific.includes(e.id))
					})
				}
			}

			setProducts(prods)
			setLoading(false)
		}
		getCollection()
	}, [filter])


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
								<p>Planned to sell: {e.sellCount}</p>
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