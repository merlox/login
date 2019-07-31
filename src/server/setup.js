const mongoose = require('mongoose')

mongoose.connect('mongodb://example:example1@ds157707.mlab.com:57707/authentication', {
	useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('Openned connection')
})
