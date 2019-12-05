import React, { useState } from 'react'
import ListProducts from './ListProducts'
import firebase from '../firebase'

const EditProduct = () => {

	const [buyDataLen, setBuyDataLen] = useState(0)
	const [oldProduct, setOldProduct] = useState({})
	const [product, setProduct] = useState({})
	const [choosingProduct, setChoosingProduct] = useState(true)
	const [saving, setSaving] = useState(false)

	const delPutschareItem = index => {

		setBuyDataLen(l => --l)
		let purscharePrices = [...product.purscharePrices]
		let purschareCounts = [...product.purschareCounts]

		purscharePrices.splice(index, 1)
		purschareCounts.splice(index, 1)

		setProduct(prevState => ({
			...prevState,
			purscharePrices,
			purschareCounts
		}))
	}

	const updateProduct = (value, field, index) => {
		let na
		if (index !== undefined) {
			console.log(index)
			na = [...product[field]]
			na[index] = value
			value = na
		}
		setProduct(prevState => ({ ...prevState, [field]: value }))
	}

	const applyEditingProduct = async () => {
		setSaving(true)
		await firebase.deleteProduct(oldProduct)
		await firebase.addProduct(product)
		setSaving(false)
		setChoosingProduct(true)
	}

	const deleteProduct = () => {
		if (window.confirm('Are you really want to delete product?')) {
			firebase.deleteProduct(oldProduct)
			setChoosingProduct(true)
		}
	}

	const chooseProduct = product => {
		setProduct(product)
		setOldProduct(product)
		// firebase.memorizeProduct(product)
		setChoosingProduct(false)
		setBuyDataLen(product.purscharePrices.length)
	}

	return (
		<div>
			{choosingProduct ? <ListProducts chooseProduct={chooseProduct} title='Products list' /> :

				product.purscharePrices ?

					<div>
						<h1>Editing</h1>
						<p>Название: </p>
						<input
							name='name'
							value={product.name}
							onChange={e => updateProduct(e.target.value, 'name')}
						/>

						<p>Атрибут: </p>
						<input
							name='attribute'
							value={product.attribute}
							onChange={e => updateProduct(e.target.value, 'attribute')}
						/>

						{product.purscharePrices.map((p, i) => (<div style={{ border: '1px solid black' }} key={i}>
							<p>Цена закупки:</p>
							{/* ! Make money parser */}
							<input
								name={`purscharePrice${i}`}
								autoFocus
								value={p}
								onChange={e => updateProduct(e.target.value, 'purscharePrices', i)}
							/>

							<p>Количество:</p>
							<input
								name={`purschareCount${i}`}
								value={product.purschareCounts[i]}
								onChange={e => updateProduct(e.target.value, 'purschareCounts', i)}
							/>
							{buyDataLen > 1 && <button onClick={() => delPutschareItem(i)}>Clear</button>}
						</div>))}

						<p>Цена продажи:</p>
						<input
							name='sellPrice'
							value={product.sellPrice}
							onChange={e => updateProduct(e.target.value, 'sellPrice')}
						/>

						<br />
						<br />

						{saving && <div>Saving</div>}

						<button onClick={() => setChoosingProduct(true)}>Cancel</button>
						<button onClick={deleteProduct}>Delete</button>
						<button onClick={applyEditingProduct}>Save changes</button>

						<br />
						<br />

					</div> : <div>Loadingy</div>}
		</div>
	)
}

export default EditProduct