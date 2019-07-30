const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

// Set the webpack hot reloading functionality with a custom server
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
		heartbeat: 10 * 1000
	}))
}

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

app.get('/__webpack_hmr', (req, res) => {
	return res.sendFile(path.join(__dirname, '../../dist/build.js'))
})

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

app.listen(port, '0.0.0.0', (req, res) => {
	console.log(`Listening on localhost:${port}`)
})
