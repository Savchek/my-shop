import React, { useState } from 'react'
import firebase from '../firebase'

const AddProduct = ({ updateScreen }) => {

	const [product, setProduct] = useState({
		name: '',
		attribute: '',
		purscharePrices: ['0'],
		purschareCounts: ['0'],
		sellPrice: '0',
		sellCount: '0',
		id: Math.random()
	})

	const updateProduct = (value, field, buyData = false) => {
		if (buyData) {
			setProduct(prevState => ({
				...prevState,
				[field]: [value]
			}))
		} else {
			setProduct(prevState => ({
				...prevState,
				[field]: value
			}))
		}
	}

	const addProduct = async () => {
		if (firebase.collection.products.some(e => (
			e.name.toLowerCase() === product.name.toLowerCase() &&
			e.attribute.toLowerCase() === product.attribute.toLowerCase()
		))) {
			alert('Item with that name and attribute already exist')
		} else {
			await firebase.addProduct(product)
			updateScreen('EditProduct')
		}
	}


	return (
		<div>
			<label>Name</label>
			<input
				name='name'
				value={product.name}
				onChange={e => updateProduct(e.target.value, 'name')}
			/>

			<label>Attribute</label>
			<input
				name='attribute'
				value={product.attribute}
				onChange={e => updateProduct(e.target.value, 'attribute')}
			/>

			<label>Allbuy price</label>
			<input
				name='allpurscharePrice'
				value={product.purscharePrices[0]}
				onChange={e => updateProduct(e.target.value, 'purscharePrices', true)}
			/>

			<label>Allbuy count</label>
			<input
				name='allpurschareCount'
				value={product.purschareCounts[0]}
				onChange={e => updateProduct(e.target.value,
					'purschareCounts', true)}
			/>

			<label>Sell price</label>
			<input
				name='sellPrice'
				value={product.sellPrice}
				onChange={e => updateProduct(e.target.value, 'sellPrice')}
			/>

			<button onClick={addProduct}>Add</button>
		</div>
	)
}

export default AddProduct