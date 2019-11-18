import React, { useState, useEffect } from 'react'
import Cookie from 'js-cookie'
import { Link } from 'react-router-dom'

export default props => {
  const [email, setEmail] = useState(localStorage.getItem('email') ? localStorage.getItem('email') : '')

  const logOut = () => {
    localStorage.setItem('email', undefined)
    Cookie.remove('token')
    props.redirecTo(props.history, '/')
  }

  return (
    <div className="page">
      <h1>Welcome {email}!</h1>
      <div className="link-container">
        <Link className="boxy-link" to="/" onClick={() => {
          logOut()
        }}>Log out</Link>
      </div>
    </div>
  )
}
