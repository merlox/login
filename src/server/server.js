require('dotenv-safe').config()

const { FORGOT_PASSWORD_DOMAIN } = process.env
const express = require('express')
const bodyParser = require('body-parser')
const limiter = require('express-rate-limit')
const path = require('path')
const app = express()
const jwt = require('jsonwebtoken')
const User = require('./user')
const ForgotPasswordToken = require('./forgotPasswordToken')
const setup = require('./setup')
const bcrypt = require('bcrypt')
const yargs = require('yargs')
const sendEmail = require('./sendEmail')
const argv = yargs.option('port', {
    alias: 'p',
    description: 'Set the port to run this server on',
    type: 'number',
}).help().alias('help', 'h').argv
if(!argv.port) {
    console.log('Error, you need to pass the port you want to run this application on with npm start -- -p 8001')
    process.exit(0)
}
const port = argv.port

// This is to simplify everything but you should set it from the terminal
// required to encrypt user accounts
process.env.SALT = 'express'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', (req, res, next) => {
	// Logger
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
	next()
})

// To register a new user
app.post('/user', async (req, res) => {
	try {
		let foundUser = await User.findOne({email: req.body.email})
		// If we found a user, return a message indicating that the user already exists
		if(foundUser) {
			res.status(400).json({
				ok: false,
				message: 'The user already exists, login or try again',
			})
		} else {
      if (req.body.password.length < 6) {
        res.status(400).json({
  				ok: false,
  				message: 'The password must be at least 6 characters',
  			})
      }
			let newUser = new User({
				email: req.body.email,
				password: req.body.password,
			})
			newUser.save(err => {
				if(err) {
					return res.status(400).json({
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
		res.status(400).json({
			ok: false,
			message: 'There was an error processing your request, try again',
		})
	}
})

// To login with an existing user
/*
	1. Check if user already exists
	2. If not, return a message saying user not found
	3. If found, generate the JWT token and send it
*/
app.post('/user/login', async (req, res) => {
	try {
		let foundUser = await User.findOne({email: req.body.email})
		if(foundUser) {
			foundUser.comparePassword(req.body.password, (isMatch) => {
				if(!isMatch) {
					res.status(400).json({
						ok: false,
						message: 'User found but the password is invalid',
					})
				} else {
					const token = jwt.sign({userId: foundUser._id}, process.env.SALT)
					return res.status(200).json({
						ok: true,
						message: {
							email: foundUser.email,
							password: req.body.password,
							token,
						}
					})
				}
			})
		} else {
			res.status(400).json({
				ok: false,
				message: 'User not found',
			})
		}
	} catch(err) {
		res.status(400).json({
			ok: false,
			message: 'Invalid password or email',
		})
	}
})

app.post('/forgot-password', limiter({
  windowMs: 10 * 60 * 1000, // One every 10 minutes if blocked
  max: 10, // Start limiting after 10 requests
  message: "You're making too many requests to this endpoint",
}), async (req, res) => {
  // Find if the email received exists or not
  try {
    const foundUser = await User.findOne({
      email: req.body.email,
    })
    if (!foundUser) {
      return res.status(400).json({
        ok: false,
        msg: 'The email address is not registered',
      })
    }
  } catch (e) {
    return res.status(400).json({
      ok: false,
      msg: 'There was an error checking the user email address'
    })
  }
  const token = String(Math.ceil(Math.random() * 16))
  const recoveryLink = `${FORGOT_PASSWORD_DOMAIN}forgot-password/${token}/${req.body.email}`
  // Store token in the db
  const tokenSave = new ForgotPasswordToken({
    email: req.body.email,
    token,
  })
  tokenSave.save(async err => {
    if(err) {
      return res.status(400).json({
        ok: false,
        message: 'There was an error saving the recovery token, try again',
      })
    }
    try {
      // Send email
      await sendEmail(req.body.email, 'Reset your account password', `If you're receiving this message is because you've clicked on 'I forgot my password' on the login page. Here's your recovery link: ${recoveryLink}`)
    } catch (e) {
      res.status(400).json({
        ok: false,
        msg: 'There was an error sending your recovery email, try again in a moment'
      })
    }
  })
})

// The endpoint called when clicking on the recovery password email
app.get('/forgot-password/:token/:email', limiter({
  windowMs: 10 * 60 * 1000, // One every 10 minutes if blocked
  max: 10, // Start limiting after 10 requests
  message: "You're making too many requests to this endpoint",
}), async (req, res) => {
  // First check that the token is valid, and if it is, show him the setup new password page
  try {
    const foundToken = await ForgotPasswordToken.findOne({
      email: req.params.email,
      token: req.params.token,
    })
    if (!foundToken) {
      return res.status(400).json({
        ok: false,
        msg: `The token is invalid, try again`,
      })
    } else {
      // Redirects to the usual page but in react it will display the right form
      res.redirect(`/reset-password-form?email=${req.params.email}&token=${req.params.token}`)
    }
  } catch (e) {
    return res.status(400).json({
      ok: false,
      msg: `Couldn't check your password recovery url, try to generate a new one`,
    })
  }
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
	else res.status(401).json({error: 'You must be logged to access this page'})
}
