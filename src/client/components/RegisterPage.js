import React, { useState, useEffect } from 'react'
import Cookie from 'js-cookie'
import Spinner from './Spinner'

export default props => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [displayPasswordError, setDisplayPasswordError] = useState(false)
  const [displayEmailError, setDisplayEmailError] = useState(false)
  const [postError, setPostError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  const checkIfLoggedIn = () => {
    if(Cookie.get('token')) props.redirectTo(props.history, '/user')
  }

  // Returns true if the email is valid or false if not just in case the normal html validation doesn't work
  const validateEmail = () => {
    // Check if the email is valid using the official RFC 5322 standard for email addresses
    let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    let isValid = false
    if(email.length != 0 && regex.test(email)) {
      isValid = true
      setDisplayEmailError(false)
    } else {
      setDisplayEmailError(true)
    }
    return isValid
  }

  // Returns true if the password length is larger than 0 and if the passwords match
  const validatePasswords = () => {
    let isValid = false
    if(password.length > 0 && password === repeatPassword) {
      isValid = true
      setDisplayPasswordError(false)
    } else {
      setDisplayPasswordError(true)
    }
    return isValid
  }

  const submitNewUser = async () => {
    // First check if the email and passwords are valid, else stop
    if(!validateEmail() || !validatePasswords()) return
    setLoading(true)
    const user = {
      email,
      password,
    }
    let fetchResult = await fetch('/user', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    let jsonResult = await fetchResult.json()
    setLoading(false)
    if(jsonResult && !jsonResult.ok) {
      setPostError(jsonResult.message)
    } else if(jsonResult && jsonResult.ok) {
      Cookie.set('token', jsonResult.message.token)
      localStorage.setItem('email', email)
      props.redirectTo(props.history, "/user")
    }
  }

  return (
    <div className="page register-page">
      <h1>Register</h1>
      <p>Complete the form to register a new account</p>
      <form onSubmit={event => {
        event.preventDefault()
        submitNewUser()
      }}>
        <div className={displayPasswordError ? "error-message" : "hidden"}>The passwords don't match</div>
        <div className={displayEmailError ? "error-message" : "hidden"}>The email is not valid</div>
        <div className={postError.length > 0 ? "error-message" : "hidden"}>{postError}</div>
        <input type="email" onChange={input => {
          setEmail(input.target.value)
        }} placeholder="Your best email" autoComplete="username"/>
        <input type="password" onChange={input => {
          setPassword(input.target.value)
        }} placeholder="Your password" autoComplete="new-password"/>
        <input type="password" onChange={input => {
          setRepeatPassword(input.target.value)
        }} placeholder="Repeat your password" autoComplete="new-password"/>
        <button type="submit" disabled={loading}>
          {loading ? <Spinner className="spinner"/> : 'Register'}
        </button>
      </form>
    </div>
  )
}
