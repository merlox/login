import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Nav extends Component {
	constructor () {
		super()
    }

	render () {
		return (
			<div className="nav">
				<Link className="boxy-link" to="/">Home</Link>
				<Link className="boxy-link" to="/login">Login</Link>
				<Link className="boxy-link" to="/register">Register</Link>
            </div>
		)
	}
}

export default Nav
