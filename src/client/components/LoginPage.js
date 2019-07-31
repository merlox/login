import React, { Component } from 'react'

export default class LoginPage extends Component {
    constructor () {
        super()

        this.state = {
            password: '',
            repeatPassword: '',
            displayError: false,
        }
    }

    render () {
        return (
            <div className="page register-page">
                <h1>Login</h1>
                <p>Login with your email and password</p>
                <form onSubmit={event => {
                    event.preventDefault()
                }}>
                    <div className={this.state.displayError ? "error-message" : "hidden"}>The passwords don't match</div>
                    <input type="email" placeholder="Your email"/>
                    <input type="password" onChange={input => {
                        this.setState({password: input.target.value})
                    }} placeholder="Your password"/>
                    <input className="submit-button" type="submit" value="Login" />
                </form>
            </div>
        )
    }
}
