import React, { Component } from 'react'
import Cookie from 'js-cookie'
import { Link } from 'react-router-dom'

export default class UserPage extends Component {
  constructor () {
    super()

    this.state = {
      email: localStorage.getItem('email') ? localStorage.getItem('email') : ''
    }
  }

  logOut() {
    localStorage.setItem('email', undefined)
    Cookie.remove('token')
    this.props.redirecTo(this.props.history, '/')
  }

  render () {
    return (
      <div className="page welcome-page">
      <h1>Welcome {this.state.email}!</h1>
      <div className="link-container">
      <Link className="boxy-link" to="/" onClick={() => {
        this.logOut()
      }} >Log out</Link>
      </div>
      </div>
    )
  }
}
