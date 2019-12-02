module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': 'eslint:recommended',
	'globals': {
		'process': true,
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
	'rules': {
		// 'react/jsx-no-undef': 1,
		'react/jsx-uses-react': 1,
		'react/jsx-uses-vars': 1,
		'no-unused-vars': 1,
		'no-process-env': 0,
		'indent': [
			1,
			'tab'
		],
		'quotes': [
			1,
			'single'
		],
		'semi': [
			1,
			'never'
		]
	}
}