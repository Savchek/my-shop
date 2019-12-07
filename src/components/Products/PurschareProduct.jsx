import React, { useState } from 'react'
import ListProducts from './ListProducts'
import firebase from '../firebase'


const PurschareProduct = () => {

	const [choosingProduct, setChoosingProduct] = useState(true)
	const [product, setProduct] = useState({})
	const [saving, setSaving] = useState(false)

	const [price, setPrice] = useState('')
	const [count, setCount] = useState('')

	const chooseProduct = product => {
		setProduct(product)
		setChoosingProduct(false)
	}

	const purschare = async () => {

		if (price.length < 1 || count.length < 1) {
			alert('Fill all fields')
			return 0
		}
		let check = price.replace(',', '.').split('.')
		if (check.length > 2 || check.find(e => (isNaN(e) || e < 0)) || (check.length === 2 && check[1].length > 2) || check[0][0] === '0') {
			alert('Input valid price')
			return 0
		}

		setSaving(true)

		await firebase.deleteProduct(product)
		let nProduct = product

		const priceIndex = product.purscharePrices.indexOf(price)

		if (priceIndex === -1) {
			nProduct.purscharePrices.push(price)
			nProduct.purschareCounts.push(count)
		} else {
			nProduct.purscharePrices = nProduct.purscharePrices.map((e, i) => i === priceIndex ? price : e)
			nProduct.purschareCounts = nProduct.purschareCounts.map((e, i) => i === priceIndex ? parseFloat(e) + parseFloat(count) : e)
		}

		nProduct.sellCounts.push('0')

		await firebase.addProduct(nProduct)
		setSaving(false)
		setChoosingProduct(true)
		setPrice('')
		setCount('')
	}


	return (
		<div>
			<h1>Purscharing</h1>
			{choosingProduct ?
				<ListProducts chooseProduct={chooseProduct} title='Choose product to purschare' filter='all' /> :

				<div>
					<h1>{product.name}</h1>

					<p>Price</p>
					<input
						name='price'
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>

					<p>Count</p>
					<input
						name='count'
						type='number'
						value={count}
						onChange={e => setCount(e.target.value.replace(/\D/, ''))}
					/>

					{saving && <div className='saving'>Saving</div>}
					<button onClick={() => setChoosingProduct(true)}>Choose another product</button>
					<button onClick={purschare}>Apply</button>
				</div>}
		</div>
	)
}

export default PurschareProduct