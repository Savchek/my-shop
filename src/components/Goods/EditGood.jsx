import React, { useState } from 'react'
import ListGoods from './ListGoods'
import firebase from '../firebase'

const EditGood = () => {

	const [buyDataLen, setBuyDataLen] = useState(0)
	const [oldGood, setOldGood] = useState({})
	const [good, setGood] = useState({})
	const [choosingGood, setChoosingGood] = useState(true)
	const [saving, setSaving] = useState(false)

	const delPutschareItem = index => {

		setBuyDataLen(l => --l)
		let buyPrices = [...good.buyPrices]
		let buyCounts = [...good.buyCounts]

		buyPrices.splice(index, 1)
		buyCounts.splice(index, 1)

		setGood(prevState => ({
			...prevState,
			buyPrices,
			buyCounts
		}))
	}

	const updateGood = (value, field, index = -1) => {
		let na
		if (index !== -1) {
			na = good[field]
			na[index] = value
			value = na
		}
		setGood(prevState => ({ ...prevState, [field]: value }))
	}

	const applyEditingGood = async () => {
		setSaving(true)
		await firebase.deleteGood(oldGood)
		await firebase.addGood(good)
		setSaving(false)
		setChoosingGood(true)
	}

	const deleteGood = () => {
		if (window.confirm('Are you really want to delete good?')) {
			firebase.deleteGood(oldGood)
			setChoosingGood(true)
		}
	}

	const chooseGood = good => {
		setGood(good)
		setOldGood(good)
		// firebase.memorizeGood(good)
		setChoosingGood(false)
		setBuyDataLen(good.buyPrices.length)
	}

	return (
		<div>
			{choosingGood ? <ListGoods chooseGood={chooseGood} title='Goods list' /> :

				good.buyPrices ?

					<div>
						<h1>Editing</h1>
						<p>Название: </p>
						<input
							name='name'
							value={good.name}
							onChange={e => updateGood(e.target.value, 'name')}
						/>

						<p>Атрибут: </p>
						<input
							name='attribute'
							value={good.attribute}
							onChange={e => updateGood(e.target.value, 'attribute')}
						/>

						{good.buyPrices.map((p, i) => (<div style={{ border: '1px solid black' }} key={p}>
							<p>Цена закупки:</p>
							{/* ! Make money parser */}
							<input
								name={`buyPrice${i}`}
								autoFocus
								value={p}
								onChange={e => updateGood(e.target.value, 'buyPrices', i)}
							/>

							<p>Количество:</p>
							<input
								name={`buyCount${i}`}
								value={good.buyCounts[i]}
								onChange={e => updateGood(e.target.value, 'buyCounts', i)}
							/>
							{buyDataLen > 1 && <button onClick={() => delPutschareItem(i)}>Clear</button>}
						</div>))}

						<p>Цена продажи:</p>
						<input
							name='sellPrice'
							value={good.sellPrice}
							onChange={e => updateGood(e.target.value, 'sellPrice')}
						/>

						<br />
						<br />

						{saving && <div>Saving</div>}

						<button onClick={() => setChoosingGood(true)}>Cancel</button>
						<button onClick={deleteGood}>Delete</button>
						<button onClick={applyEditingGood}>Save changes</button>

						<br />
						<br />

					</div> : <div>Loadingy</div>}
		</div>
	)
}

export default EditGood