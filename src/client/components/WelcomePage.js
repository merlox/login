import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'

export default class WelcomePage extends Component {
  constructor () {
    super()

    this.state = {
      newVisitor: typeof window.localStorage.newVisitor == 'undefined'
    }
    window.localStorage.newVisitor = false
  }

  componentDidMount() {
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn() {
    if(Cookie.get('token')) this.props.redirectTo(this.props.history, '/user')
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
