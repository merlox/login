const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', (req, res, next) => {
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)

	next()
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
