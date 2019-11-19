import React, { useState } from 'react'
import Cookie from 'js-cookie'
import Spinner from './Spinner'

export default props => {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Returns true if the password length is larger than 0 and if the passwords match
  const validatePasswords = () => {
    let isValid = false
    if(password.length > 0 && password == repeatPassword) {
      isValid = true
      setError('')
    } else {
      setError(`The passwords don't match`)
    }
  }

  // Returns null if not found or the item value
  const getQueryVariable = variable => {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1])
      }
    }
    return null
  }

  const submitNewPassword = async () => {
    setError('')
    // First check if the email and passwords are valid, else stop
    validatePasswords()
    const emailFound = getQueryVariable('email')
    const tokenFound = getQueryVariable('token')
    if (!emailFound || !tokenFound) return setError('The password reset is invalid, try generating a new password reset request from the beginning')
    setLoading(true)
    const user = {
      email: emailFound,
      token: tokenFound,
      password,
    }
    let request = await fetch('/user', {
      method: 'put',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user)
    })
    let response = await request.json()
    setLoading(false)
    if (!response) {
      return setError('There was an error making the request')
    }
    if (!response.ok) {
      setError(response.msg)
    } else {
      props.redirectTo(props.history, "/login")
    }
  }

  return (
    <div className="page register-page">
      <h1>Password reset</h1>
      <p>Create a new password for your account</p>
      <form onSubmit={event => {
        event.preventDefault()
        submitNewPassword()
      }}>
        <div className={error.length > 0 ? "error-message" : "hidden"}>{error}</div>
        <input type="password" onChange={input => {
          setPassword(input.target.value)
        }} placeholder="Your password" autoComplete="new-password"/>
        <input type="password" onChange={input => {
          setRepeatPassword(input.target.value)
        }} placeholder="Repeat your password" autoComplete="new-password"/>
        <button type="submit" disabled={loading}>
          {loading ? <Spinner className="spinner"/> : 'Save Password'}
        </button>
      </form>
    </div>
  )
}
