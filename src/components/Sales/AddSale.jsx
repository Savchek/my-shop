import React, { useState } from 'react'
import ListProducts from '../Products/ListProducts'
import firebase from '../firebase'

const ListSales = ({ updateScreen }) => {

	const [oldProduct, setOldProduct] = useState()
	const [choosingProduct, setChoosingProduct] = useState(true)
	const [available, setAvailable] = useState(0)
	const [sale, setSale] = useState({
		title: '',
		buyerInfo: {
			name: '',
			address: '',
			phone: ''
		},
		saleItemInfo: {
			name: '',
			purscharePrices: [],
			sellPrice: '',
			sellCount: ''
		},
		done: false,
		date: '',
		id: Math.random()
	})

	const updTitle = title => {
		setSale(s => ({ ...s, title }))
	}

	const updSaleInfo = (section, field, value) => {
		setSale(s => ({
			...s,
			[section]: {
				...s[section],
				[field]: value
			}
		}))
	}

	const chooseProduct = product => {
		setOldProduct(Object.assign({}, product))
		updSaleInfo('saleItemInfo', 'name', product.name)
		updSaleInfo('saleItemInfo', 'sellPrice', product.sellPrice)
		let avail = product.purschareCounts.reduce((t, v) => t + parseInt(v), 0) - parseInt(product.sellCount)
		setAvailable(avail)

		setChoosingProduct(false)
	}

	const addSale = () => {
		if (sale.saleItemInfo.sellCount < 0) {
			alert('Invalid count value')
			return 0
		}
		if (sale.saleItemInfo.sellCount > available) {
			alert('Dont have that many available products')
			return 0
		}
		if (!sale.buyerInfo.name.trim()) {
			alert('Input buyer\'s name')
			return 0
		}


		let updProduct = Object.assign({}, oldProduct)
		console.log('Updatable product')
		console.log(oldProduct)

		// changing purschares values
		// let sellC = parseInt(sale.saleItemInfo.sellCount)
		// while (sellC > 0) {

		// 	let highestPrice = 0, index

		// 	updProduct.purscharePrices.forEach((v, i) => {
		// 		let pv = parseFloat(v)
		// 		if (pv > highestPrice && parseInt(updProduct.purschareCounts[i]) !== 0) {
		// 			highestPrice = pv
		// 			index = i
		// 		}
		// 	})

		// 	let count = updProduct.purschareCounts[index]

		// 	if (sellC <= count) {
		// 		updProduct.purschareCounts[index] = parseInt(updProduct.purschareCounts[index]) - sellC
		// 		break
		// 	} else {
		// 		updProduct.purschareCounts[index] = 0
		// 		sellC -= count
		// 	}

		// }

		// increasing product sellCount value
		updProduct.sellCount = parseFloat(updProduct.sellCount) + parseFloat(sale.saleItemInfo.sellCount)
		setSale(s => ({ ...s, date: new Date() }))

		console.log('Old product:')
		console.log(oldProduct)
		console.log('New product:')
		console.log(updProduct)
		console.log('Sale data:')
		console.log(sale)
	}




	return (
		<div>
			<h1>Adding sale</h1>
			{choosingProduct ?
				<ListProducts chooseProduct={chooseProduct} title='Choose product to sell' /> :
				<div>
					<p>Title</p>
					<input
						name='saleTitle'
						value={sale.title}
						onChange={e => updTitle(e.target.value)}
					/>

					<br />
					<p>Product info:</p>
					<br />

					<p>Name: {sale.saleItemInfo.name}</p>

					<p>Sell price: {sale.saleItemInfo.salePrice}</p>

					<p>Count ({available} available)</p>
					<input
						name='productPurschareCount'
						value={sale.saleItemInfo.sellCount}
						onChange={e => updSaleInfo('saleItemInfo', 'sellCount', e.target.value)}
					/>
					<button onClick={() => setChoosingProduct(true)}>Choose another product</button>

					<br />

					<p>Buyer Info:</p>
					<br />
					<p>Name</p>
					<input
						name='buyerName'
						value={sale.buyerInfo.name}
						onChange={e => updSaleInfo('buyerInfo', 'name', e.target.value)}
					/>

					<p>Address</p>
					<input
						name='buyerAddress'
						value={sale.buyerInfo.address}
						onChange={e => updSaleInfo('buyerInfo', 'address', e.target.value)}
					/>

					<p>Phone</p>
					<input
						name='buyerPhone'
						value={sale.buyerInfo.phone}
						onChange={e => updSaleInfo('buyerInfo', 'phone', e.target.value)}
					/>
					<br />
					<button onClick={addSale}>Create</button>
				</div>
			}
		</div>
	)
}

export default ListSales