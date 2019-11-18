import React, { Component } from 'react'
import Cookie from 'js-cookie'

export default class LoginPage extends Component {
  constructor () {
    super()

    this.state = {
      password: '',
      repeatPassword: '',
      displayPasswordError: false,
      displayEmailError: false,
      postError: '',
    }
    this.checkIfLoggedIn()
  }

  componentDidMount() {
    this.checkIfLoggedIn()
  }

  // Redirect user to the /user page if already logged in
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


  async logIn() {
    // First check if the email and passwords are valid, else stop
    if(!this.validateEmail()) return

    const user = {
      email: this.state.email,
      password: this.state.password,
    }

    let fetchResult = await fetch('/user/login', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
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
      <div className={this.state.displayPasswordError ? "error-message" : "hidden"}>The passwords don't match</div>
      <div className={this.state.displayEmailError ? "error-message" : "hidden"}>The email is not valid</div>
      <div className={this.state.postError.length > 0 ? "error-message" : "hidden"}>{this.state.postError}</div>
      <input type="email" onChange={input => {
        this.setState({email: input.target.value})
      }} placeholder="Your best email" autocomplete="username"/>
      <input type="password" onChange={input => {
        this.setState({password: input.target.value})
      }} placeholder="Your password" autocomplete="current-password"/>
      <input className="submit-button" type="submit" value="Login" />
      </form>
      </div>
    )
  }
}
