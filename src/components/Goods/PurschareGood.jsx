import React, { useState } from 'react'
import ListGoods from './ListGoods'
import firebase from '../firebase'


const PurschareGood = () => {

	const [choosingGood, setChoosingGood] = useState(true)
	const [good, setGood] = useState({})
	const [saving, setSaving] = useState(false)

	const [price, setPrice] = useState('')
	const [count, setCount] = useState('')

	const chooseGood = good => {
		setGood(good)
		setChoosingGood(false)
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

		await firebase.deleteGood(good)
		let nGood = good

		const priceIndex = good.buyPrices.indexOf(price)

		if (priceIndex === -1) {
			nGood.buyPrices.push(price)
			nGood.buyCounts.push(count)
		} else {
			nGood.buyPrices = nGood.buyPrices.map((e, i) => i === priceIndex ? price : e)
			nGood.buyCounts = nGood.buyCounts.map((e, i) => i === priceIndex ? parseFloat(e) + parseFloat(count) : e)
		}

		await firebase.addGood(nGood)
		setSaving(false)
		setChoosingGood(true)
		setPrice('')
		setCount('')
	}


	return (
		<div>
			<h1>Purscharing</h1>
			{choosingGood ?
				<ListGoods chooseGood={chooseGood} title='Choose good to purschare' /> :

				<div>
					<h1>{good.name}</h1>

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
					<button onClick={() => setChoosingGood(true)}>Choose another good</button>
					<button onClick={purschare}>Apply</button>
				</div>}
		</div>
	)
}

export default PurschareGood