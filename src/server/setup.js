const mongoose = require('mongoose')

mongoose.connect('mongodb://example:example1@ds157707.mlab.com:57707/authentication', {
	useNewUrlParser: true,
	useCreateIndex: true,
})

const db = mongoose.connection
db.on('error', err => {
	console.log('Error connecting to the database', err)
})
db.once('open', function() {
    console.log('Opened database connection')
})
