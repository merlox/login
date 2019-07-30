import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Nav extends Component {
	constructor () {
		super()
    }

	render () {
		return (
			<div className="nav">
				<Link to="/">Home</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
            </div>
		)
	}
}

export default Nav
