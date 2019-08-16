import React, { Component } from 'react'
import Cookie from 'js-cookie'

export default class LoginPage extends Component {
    constructor () {
        super()

        this.state = {
            password: '',
            repeatPassword: '',
            displayError: false,
        }
        this.checkIfLoggedIn()
    }

    componentDidMount() {
        this.checkIfLoggedIn()
    }

    checkIfLoggedIn() {
        if(Cookie.get('token')) this.props.redirectTo(this.props.history, '/user')
    }


    // Returns true if the email is valid or false if not just in case the normal html validation doesn't work
    validateEmail() {
        // Check if the email is valid using the official RFC 5322 standard for email addresses
        let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        let isValid = false

        if(this.state.email.length != 0 && regex.test(this.state.email)) {
            isValid = true
            this.setState({displayEmailError: false})
        } else {
            this.setState({displayEmailError: true})
        }
        return isValid
    }

    // Returns true if the password length is larger than 0 and if the passwords match
    validatePasswords() {
        let isValid = false

        if(this.state.password.length > 0 && this.state.password === this.state.repeatPassword) {
            isValid = true
            this.setState({displayPasswordError: false})
        } else {
            this.setState({displayPasswordError: true})
        }
        return isValid
    }

    async logIn() {
        // First check if the email and passwords are valid, else stop
        if(!this.validateEmail() || !this.validatePasswords()) return

        const user = {
            email: this.state.email,
            password: this.state.password,
        }

        let fetchResult = await fetch('/user', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        let jsonResult = await fetchResult.json()
        if(jsonResult && !jsonResult.ok) {
            this.setState({postError: jsonResult.message})
        } else if(jsonResult && jsonResult.ok) {
            Cookie.set('token', jsonResult.message.token)
            localStorage.setItem('email', this.state.email)
            this.props.redirectTo(this.props.history, "/user")
        }
    }

    render () {
        return (
            <div className="page register-page">
                <h1>Login</h1>
                <p>Login with your email and password</p>
                <form onSubmit={event => {
                    event.preventDefault()
                    this.logIn()
                }}>
                    <div className={this.state.displayError ? "error-message" : "hidden"}>The passwords don't match</div>
                    <input type="email" onChange={input => {
                        this.setState({email: input.target.value})
                    }} placeholder="Your best email"/>
                    <input type="password" onChange={input => {
                        this.setState({password: input.target.value})
                    }} placeholder="Your password"/>
                    <input className="submit-button" type="submit" value="Login" />
                </form>
            </div>
        )
    }
}
