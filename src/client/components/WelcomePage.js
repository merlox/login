import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class WelcomePage extends Component {
    constructor () {
        super()

        this.state = {
            newVisitor: typeof window.localStorage.newVisitor == 'undefined'
        }
        window.localStorage.newVisitor = false
    }

    render () {
        return (
            <div className="page welcome-page">
                <h1>Welcome{this.state.newVisitor ? '!' : ', again!'}</h1>
                <p>Login or register to access the page</p>
                <div className="link-container">
                    <Link className="boxy-link" to="/login">Login</Link>
                    <Link className="boxy-link" to="/register">Register</Link>
                </div>
            </div>
        )
    }
}
