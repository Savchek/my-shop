import React, { useState } from 'react'
import firebase from '../firebase'

const AddGood = ({ updateScreen }) => {

	const [good, setGood] = useState({
		name: '',
		attribute: '',
		buyPrices: ['0'],
		buyCounts: ['0'],
		sellPrice: '0',
		id: Math.random()
	})

	const updateGood = (value, field, buyData = false) => {
		if (buyData) {
			setGood(prevState => ({
				...prevState,
				[field]: [value]
			}))
		} else {
			setGood(prevState => ({
				...prevState,
				[field]: value
			}))
		}
	}

	const addGood = async () => {
		if (firebase.collection.goods.some(e => e.name === good.name)) {
			alert('Item with that name already exist')
		} else {
			await firebase.addGood(good)
			updateScreen('EditGood')
		}
	}


	return (
		<div>
			<label>Name</label>
			<input
				name='name'
				value={good.name}
				onChange={e => updateGood(e.target.value, 'name')}
			/>

			<label>Attribute</label>
			<input
				name='attribute'
				value={good.attribute}
				onChange={e => updateGood(e.target.value, 'attribute')}
			/>

			<label>Allbuy price</label>
			<input
				name='allbuyPrice'
				value={good.buyPrices[0]}
				onChange={e => updateGood(e.target.value, 'buyPrices', true)}
			/>

			<label>Allbuy count</label>
			<input
				name='allbuyCount'
				value={good.buyCounts[0]}
				onChange={e => updateGood(e.target.value,
					'buyCounts', true)}
			/>

			<label>Sell price</label>
			<input
				name='sellPrice'
				value={good.sellPrice}
				onChange={e => updateGood(e.target.value, 'sellPrice')}
			/>

			<button onClick={addGood}>Add</button>
		</div>
	)
}

export default AddGood