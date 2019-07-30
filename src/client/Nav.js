import React from 'react'
import ReactDOM from 'react-dom'

class Nav extends React.Component {
	constructor () {
		super()
        this.state = {
            account: ''
        }
    }

	render () {
		return (
			<div className="nav">
                <div className="color-grey">{this.state.account}</div>
            </div>
		)
	}
}

export default Nav
