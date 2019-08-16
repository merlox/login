const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const jwt = require('jsonwebtoken')
const User = require('./user')
const setup = require('./setup')
const port = 8000

/*
	Messages sent to the client contain the following fields
	{
		ok: true | false, // Whether the request was successful or not
		message: {}, // The contents of the request if any
	}
*/

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

// To register a new user
app.post('/user', async (req, res) => {
	try {
		let foundUser = await User.findOne({email: req.body.email})

		// If we found a user, return a message indicating that the user already exists
		if(foundUser) {
			res.status(200).json({
				ok: false,
				message: 'The user already exists, login or try again',
			})
		} else {
			let newUser = new User({
				email: req.body.email,
				password: req.body.password,
			})

			newUser.save(err => {
				if(err) {
					return res.status(200).json({
						ok: false,
						message: 'There was an error saving the new user, try again',
					})
				}

				// Create the JWT token based on that new user
				const token = jwt.sign({userId: newUser.id}, process.env.SALT)

				// If the user was added successful, return the user credentials
				return res.status(200).json({
					ok: true,
					message: {
						email: req.body.email,
						password: req.body.password,
						token
					}
				})
			})
		}
	} catch(err) {
		res.status(200).json({
			ok: false,
			message: 'There was an error processing your request, try again',
		})
	}
})

// To login with an existing user
app.get('/user/login', (req, res) => {
	// TODO
	User.findOne({email: req.body.email}).then(foundUser => {
		console.log('found user', foundUser)
		// If we found a user, return a message indicating that the user already exists
		if(foundUser) {
			foundUser.comparePassword(req.body.password, (err, isMatch) => {
				if (isMatch) {
					const token = jwt.sign({userId: foundUser.id}, process.env.SALT)
					res.json({
						userId: foundUser.id,
						email: foundUser.email,
						token
					})
				} else {
					res.status(400).json({message: 'Invalid password or email'})
				}
			})
		} else {

		}
	}).catch(err => {
		res.status(400).json({message: 'Invalid password or email'})
	})
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
