import React, { useState } from 'react'

export default props => {
  const [email, setEmail] = useState('')
  const [postError, setPostError] = useState('')
  const [success, setSuccess] = useState('')

  const startResetPassword = async () => {
    setPostError('')
    setSuccess('')
    if (email.length == 0) return setPostError('You need to specify the email')
    try {
      const request = await fetch(`/forgot-password`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
      const response = await request.json()
      console.log('RESPONSE', response)
      if (!response) {
        setPostError('There was an error making the request')
      }
      if (!response.ok) {
        setPostError(response.msg)
      } else {
        setSuccess(response.msg)
      }
    } catch (e) {
      setPostError('There was an error making the password reset request')
    }
  }

  return (
    <div className="page register-page">
      <h1>Recover password</h1>
      <p>Write your email to receive a message with a reset link</p>
      <form onSubmit={event => {
        event.preventDefault()
        startResetPassword()
      }}>
        <div className={success.length > 0 ? "success" : "hidden"}>{success}</div>
        <div className={postError.length > 0 ? "error-message" : "hidden"}>{postError}</div>
        <input type="email" onChange={input => {
          setEmail(input.target.value)
        }} placeholder="Your best email" autoComplete="username"/>
        <input className="submit-button" type="submit" value="Reset Password" />
      </form>
    </div>
  )
}
