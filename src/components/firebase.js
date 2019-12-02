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
		this.oldGood = {}
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
			goods: [],
			sales: [],
			pastSales: []
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

	async addGood(good) {
		await this.db.collection('users').doc(this.auth.currentUser.uid).update({
			goods: app.firestore.FieldValue.arrayUnion(good)
		})
		await this.updateCollection()
	}

	async deleteGood(good) {

		await this.db.collection('users').doc(this.auth.currentUser.uid).update({
			goods: app.firestore.FieldValue.arrayRemove(good)
		})
		// then pulling data 
		await this.updateCollection()
	}

	// ! fix editing
	memorizeGood(good) {
		console.log('Memotizing good')
		this.oldGood = { ...good }
		console.log(this.oldGood)
	}
}

export default new Firebase()