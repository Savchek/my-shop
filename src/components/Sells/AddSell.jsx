import React, { useState } from 'react'
import ListProducts from '../Products/ListProducts'
import firebase from '../firebase'

const ListSells = ({ updateScreen }) => {

	const [loading, setLoading] = useState(false)
	const [oldProduct, setOldProduct] = useState()
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
		sellItemInfo: {
			name: '',
			id: '',
			purscharePrices: [],
			sellCounts: [],
			sellPrice: '',
			sellCount: ''
		},
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
		setOldProduct(Object.assign({}, product))
		updSellInfo('sellItemInfo', 'name', product.name)
		updSellInfo('sellItemInfo', 'id', product.id)
		updSellInfo('sellItemInfo', 'sellPrice', product.sellPrice)
		let avail = product.purschareCounts.reduce((t, v) => t + parseInt(v), 0) - parseInt(product.sellCount)
		setAvailable(avail)

		setChoosingProduct(false)
	}

	const addSell = async () => {
		if (sell.sellItemInfo.sellCount < 0) {
			alert('Invalid count value')
			return 0
		}
		if (sell.sellItemInfo.sellCount > available) {
			alert('Dont have that many available products')
			return 0
		}
		if (!sell.buyerInfo.name.trim()) {
			alert('Input buyer\'s name')
			return 0
		}

		let nSell = sell

		let updProduct = Object.assign({}, oldProduct)

		setLoading(true)

		await firebase.deleteProduct(oldProduct)



		// changing purschares values
		let sellC = parseInt(sell.sellItemInfo.sellCount)

		while (sellC > 0) {

			let highestPrice = 0, index

			updProduct.purscharePrices.forEach((v, i) => {
				let pv = parseFloat(v)
				if (pv > highestPrice && parseInt(updProduct.sellCounts[i]) < parseInt(updProduct.purschareCounts[i])) {
					highestPrice = pv
					index = i
				}
			})

			let count = parseInt(updProduct.purschareCounts[index])

			nSell.sellItemInfo.purscharePrices.push(highestPrice)

			if ((parseInt(updProduct.sellCounts[index]) + sellC) <= count) {
				console.log('Have full available')

				updProduct.sellCounts[index] = parseInt(updProduct.sellCounts[index]) + sellC

				nSell.sellItemInfo.sellCounts.push(sellC)

				break

			} else {
				console.log('Have partly available')
				let difference = parseInt(updProduct.purschareCounts[index]) - parseInt(updProduct.sellCounts[index])
				updProduct.sellCounts[index] = updProduct.purschareCounts[index]
				sellC -= difference

				nSell.sellItemInfo.sellCounts.push(difference)
			}

		}

		// increasing product sellCount value
		updProduct.sellCount = parseInt(updProduct.sellCount) + parseInt(sell.sellItemInfo.sellCount)

		await firebase.addProduct(updProduct)
		await firebase.addSell(nSell)
		updateScreen('ListSells')
		// console.log('Old product:')
		// console.log(oldProduct)
		// console.log('New product:')
		// console.log(updProduct)
		// console.log('Sell data:')
		// console.log(nSell)
	}




	return (
		<div>
			<h1>Adding sell</h1>
			{choosingProduct ?
				<ListProducts chooseProduct={chooseProduct} title='Choose product to sell' filter='all' /> :
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
					<p>Product info:</p>
					<br />

					<p>Name: {sell.sellItemInfo.name}</p>

					<p>Sell price: {sell.sellItemInfo.sellPrice}</p>

					<p>Count ({available} available)</p>
					<input
						name='productPurschareCount'
						value={sell.sellItemInfo.sellCount}
						onChange={e => updSellInfo('sellItemInfo', 'sellCount', e.target.value)}
					/>
					<button onClick={() => setChoosingProduct(true)}>Choose another product</button>

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