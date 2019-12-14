/* eslint-disable require-atomic-updates */
import React, { useState } from 'react'
import ListProducts from '../Products/ListProducts'
import firebase from '../firebase'

const ListSells = ({ updateScreen }) => {

	const [loading, setLoading] = useState(false)
	const [oldProduct, setOldProduct] = useState([])
	const [choosingProduct, setChoosingProduct] = useState(true)
	const [available, setAvailable] = useState(0)
	const [sell, setSell] = useState({
		title: '',
		seller: '',
		buyerInfo: {
			name: '',
			address: '',
			phone: ''
		},
		sellItemsInfo: [],
		// {
		// 	name: '',
		// 	id: '',
		// 	purscharePrices: [],
		// 	sellCounts: [],
		// 	sellPrice: '',
		// 	sellCount: '',
		// 	available: 0
		// }
		date: '',
		id: Math.random()
	})

	const updTitle = title => {
		setSell(s => ({ ...s, title }))
	}
	const updSeller = seller => {
		setSell(s => ({ ...s, seller }))
	}
	const updDate = date => {
		setSell(s => ({ ...s, date }))
	}

	const updSellInfo = (section, field, value) => {
		setSell(s => ({
			...s,
			[section]: {
				...s[section],
				[field]: value
			}
		}))
	}

	const chooseProduct = product => {
		setOldProduct(prevProducts => [...prevProducts, product])
		let newSellItem = {
			name: product.name,
			id: product.id,
			sellPrice: product.sellPrice,
			available: product.purschareCounts.reduce((t, v) => t + parseInt(v), 0) - parseInt(product.sellCount),
			purscharePrices: [],
			sellCounts: [],
			sellCount: ''
		}

		setSell(sell => ({ ...sell, sellItemsInfo: [...sell.sellItemsInfo, newSellItem] }))

		setChoosingProduct(false)
	}

	const addSell = async () => {
		if (sell.sellItemsInfo.some(e => e.sellCount < 0)) {
			alert('Invalid count value in one of the items')
			return 0
		}
		if (sell.sellItemsInfo.some(e => e.sellCount > e.available)) {
			alert('Dont have that many available products in one of the items')
			return 0
		}
		if (!sell.buyerInfo.name.trim()) {
			alert('Input buyer\'s name')
			return 0
		}
		setLoading(true)

		let nSell = { ...sell }


		oldProduct.forEach(async (product, index) => {

			await firebase.deleteProduct(product)



			// changing purschares values
			let sellC = parseInt(product.sellCount)

			while (sellC > 0) {

				let highestPrice = 0, index

				product.purscharePrices.forEach((v, i) => {
					let pv = parseFloat(v)
					if (pv > highestPrice && parseInt(product.sellCounts[i]) < parseInt(product.purschareCounts[i])) {
						highestPrice = pv
						index = i
					}
				})

				let count = parseInt(product.purschareCounts[index])

				nSell.sellItemsInfo[index].purscharePrices.push(highestPrice)

				if ((parseInt(product.sellCounts[index]) + sellC) <= count) {
					console.log('Have full available')

					product.sellCounts[index] = parseInt(product.sellCounts[index]) + sellC

					nSell.sellItemsInfo[index].sellCounts.push(sellC)

					break

				} else {
					console.log('Have partly available')
					let difference = parseInt(product.purschareCounts[index]) - parseInt(product.sellCounts[index])
					product.sellCounts[index] = product.purschareCounts[index]
					sellC -= difference

					nSell.sellItemsInfo[index].sellCounts.push(difference)
				}

			}

			// increasing product sellCount value
			product.sellCount = parseInt(product.sellCount) + parseInt(sell.sellItemsInfo[index].sellCount)

			await firebase.addProduct(product)

		})
		console.log(nSell)
		await firebase.addSell(nSell)
		updateScreen('ListSells')
		// console.log('Old product:')
		// console.log(oldProduct)
		// console.log('New product:')
		// console.log(updProduct)
		// console.log('Sell data:')
		// console.log(nSell)
	}


	const updSellCount = (value, index) => {
		let oldSell = { ...sell }
		oldSell.sellItemsInfo[index].sellCount = value
		setSell(oldSell)
	}


	return (
		<div>
			<h1>Adding sell</h1>
			{choosingProduct ?
				<ListProducts
					chooseProduct={chooseProduct}
					title='Choose product to sell'
					filter={['available', 'no-specific']}
					specific={sell.sellItemsInfo.map(e => e.id)}
				/> :
				<div>
					{loading && <div>Loading</div>}
					<p>Title</p>
					<input
						name='sellTitle'
						value={sell.title}
						onChange={e => updTitle(e.target.value)}
					/>
					<p>Seller</p>
					<input
						name='sellSeller'
						value={sell.seller}
						onChange={e => updSeller(e.target.value)}
					/>
					<p>Date</p>
					<input
						name='sellDate'
						type='date'
						value={sell.date}
						onChange={e => updDate(e.target.value)}
					/>


					<br />
					<p>Products info:</p>
					<br />

					{sell.sellItemsInfo.map((e, i) => (
						<div key={i}>
							<p>Name: {e.name}</p>

							<p>Sell price: {e.sellPrice}</p>

							<p>Count ({e.available} available)</p>

							<input
								name='productPurschareCount'
								value={e.sellCount}
								onChange={e => updSellCount(e.target.value, i)}
							/>
						</div>
					))}

					<button onClick={() => setChoosingProduct(true)}>Add another product</button>

					<br />

					<p>Buyer Info:</p>
					<br />
					<p>Name</p>
					<input
						name='buyerName'
						value={sell.buyerInfo.name}
						onChange={e => updSellInfo('buyerInfo', 'name', e.target.value)}
					/>

					<p>Address</p>
					<input
						name='buyerAddress'
						value={sell.buyerInfo.address}
						onChange={e => updSellInfo('buyerInfo', 'address', e.target.value)}
					/>

					<p>Phone</p>
					<input
						name='buyerPhone'
						value={sell.buyerInfo.phone}
						onChange={e => updSellInfo('buyerInfo', 'phone', e.target.value)}
					/>
					<br />
					<button onClick={addSell}>Create</button>
				</div>
			}
		</div>
	)
}

export default ListSells