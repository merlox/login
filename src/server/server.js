const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const jwt = require('jsonwebtoken')
const user = require('./user')
const setup = require('./setup')
const port = 8000

// This is to simplify everything but you should set it from the terminal
// required to encrypt user accounts
process.env.SALT = 'express'

// Set the webpack hot reloading functionality with a custom server on development
if(process.env.NODE_ENV != 'production') {
	console.log('Serving server on dev mode with hot reloading')
	const webpack = require('webpack')
	const webpackConfig = require(__dirname + './../../webpack.config.js')
	const compiler = webpack(webpackConfig)
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath,
	}))
	app.use(require('webpack-hot-middleware')(compiler, {
		log: console.log,
		path: '/__webpack_hmr',
		heartbeat: 5e3
	}))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', (req, res, next) => {
	// Logger
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)

	// JWT authentication
	try {
		if (typeof req.headers.authorization != 'undefined') {
			const token = req.headers.authorization.split(" ")[1]
			jwt.verify(token, key.tokenKey, async (err, payload) => {
				console.log('Payload', payload)
				if (payload) {
					const foundDoc = await user.findById(payload.userId)
					req.user = foundDoc
				}
			})
		}
	} catch (err) {
		next(err)
	}

	next()
})

app.post('/user', async (req, res) => {
	try {
		const foundUser = await user.findOne({email: req.body.email})
		// console.log('found user')
		foundUser.comparePassword(req.body.password, (err, isMatch) => {
			if (isMatch) {
				const token = jwt.sign({userId: user.id}, process.env.SALT)
				res.json({
					userId: user.id,
					email: user.email,
					token
				})
			} else {
				res.status(400).json({message: 'Invalid password or email'})
			}
		})
	} catch (err) {
		res.status(400).json({message: 'Invalid password or email'})
	}
})

app.get('/user', (req, res) => {

})

app.get('/build.js', (req, res) => {
    return res.sendFile(path.join(__dirname, '../../dist/build.js'))
})

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

app.listen(port, '0.0.0.0', (req, res) => {
	console.log(`Listening on localhost:${port}`)
})

function protectRoute(req, res, next) {
	if (req.user) next()
	else res.status(500).json({error: 'You must be logged to access this page'})
}
