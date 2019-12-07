import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig)
		this.auth = app.auth()
		this.db = app.firestore()
		// this.oldProduct = {}
		this.collection = {}
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.db.collection('users').doc(this.auth.currentUser.uid).set({
			products: [],
			sells: [],
			pastSells: []
		})
	}

	async updateCollection() {
		const collection = await this.db.collection('users').doc(this.auth.currentUser.uid).get()
		if (collection) {
			this.collection = collection.data()
		} else {
			alert('Can\'t get data from database')
		}
	}

	async addProduct(product) {
		console.log('Adding')
		console.log(product)
		await this.db.collection('users').doc(this.auth.currentUser.uid).update({
			products: app.firestore.FieldValue.arrayUnion(product)
		})
		await this.updateCollection()
	}

	async deleteProduct(product) {
		console.log('Deleting')
		console.log(product)
		await this.db.collection('users').doc(this.auth.currentUser.uid).update({
			products: app.firestore.FieldValue.arrayRemove(product)
		})
		// then pulling data 
		await this.updateCollection()
	}

	async addSell(sell) {
		await this.db.collection('users').doc(this.auth.currentUser.uid).update({
			sells: app.firestore.FieldValue.arrayUnion(sell)
		})
		await this.updateCollection()
	}

	// ! fix editing
	// memorizeProduct(product) {
	// 	console.log('Memotizing product')
	// 	this.oldProduct = { ...product }
	// 	console.log(this.oldProduct)
	// }
}

export default new Firebase()