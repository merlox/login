import React, { Component } from 'react'
import Cookie from 'js-cookie'

export default class RegisterPage extends Component {
  constructor () {
    super()
    this.state = {
      password: '',
      repeatPassword: '',
      displayPasswordError: false,
      postError: '',
    }
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

  async submitNewPassword() {
    // First check if the email and passwords are valid, else stop
    if(!this.validateEmail() || !this.validatePasswords()) return
    const user = {
      email: this.state.email,
      password: this.state.password,
    }
    let fetchResult = await fetch('/user', {
      method: 'put',
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
      <h1>Register</h1>
      <p>Complete the form to register a new account</p>
      <form onSubmit={event => {
        event.preventDefault()
        this.submitNewPassword()
      }}>
      <div className={this.state.displayPasswordError ? "error-message" : "hidden"}>The passwords don't match</div>
      <div className={this.state.displayEmailError ? "error-message" : "hidden"}>The email is not valid</div>
      <div className={this.state.postError.length > 0 ? "error-message" : "hidden"}>{this.state.postError}</div>
      <input type="email" onChange={input => {
        this.setState({email: input.target.value})
      }} placeholder="Your best email" autocomplete="username"/>
      <input type="password" onChange={input => {
        this.setState({password: input.target.value})
      }} placeholder="Your password" autocomplete="new-password"/>
      <input type="password" onChange={input => {
        this.setState({repeatPassword: input.target.value})
      }} placeholder="Repeat your password" autocomplete="new-password"/>
      <input className="submit-button" type="submit" value="Register" />
      </form>
      </div>
    )
  }
}
