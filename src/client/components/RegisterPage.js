import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'

export default class RegisterPage extends Component {
    constructor () {
        super()
    }

    render () {
        return (
            <div className="welcome-page">
                <h1>Register form  ssss</h1>
                <p>HELLO Login or register to access the page</p>
                <div className="link-container">
                    <input type="email" placeholder="Your best email"/>
                    <input type="password" placeholder="Your password"/>
                    <input type="password" placeholder="Repeat your password"/>
                    <input type="submit" />
                </div>
            </div>
        )
    }
}
