import React, { Component } from 'react'
import Nav from './Nav'

export default class RegisterPage extends Component {
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
                <h1>Register form</h1>
                <p>Complete the form to register a new account</p>
                <form onSubmit={event => {
                    event.preventDefault()
                    if(this.state.password !== this.state.repeatPassword) {
                        this.setState({displayError: true})
                    } else {
                        this.setState({displayError: false})
                    }
                }}>
                    <div className={this.state.displayError ? "error-message" : "hidden"}>The passwords don't match</div>
                    <input type="email" placeholder="Your best email"/>
                    <input type="password" onChange={input => {
                        this.setState({password: input.target.value})
                    }} placeholder="Your password"/>
                    <input type="password" onChange={input => {
                        this.setState({repeatPassword: input.target.value})
                    }} placeholder="Repeat your password"/>
                    <input className="submit-button" type="submit" value="Register" />
                </form>
            </div>
        )
    }
}
