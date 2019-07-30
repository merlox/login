import React from 'react'
import ReactDOM from 'react-dom'
import Nav from './Nav'
import './index.styl'

class App extends React.Component {
	constructor () {
		super()
	}

	render () {
		return (
			<div>
				<Nav />
				<div>The project has been installed successfully!</div>
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.querySelector('#root')
)
