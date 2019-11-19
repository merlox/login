import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'

export default props => {
  const [newVisitor, setNewVisitor] = useState(typeof window.localStorage.newVisitor == 'undefined')

  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  const checkIfLoggedIn = () => {
    if(Cookie.get('token')) props.redirectTo(props.history, '/user')
  }

  return (
    <div className="page">
      <h1>Welcome{newVisitor ? '!' : ', again!'}</h1>
      <p>Login or register to access the page</p>
      <div className="link-container">
        <Link className="boxy-link" to="/login">Login</Link>
        <Link className="boxy-link" to="/register">Register</Link>
      </div>
    </div>
  )
}
