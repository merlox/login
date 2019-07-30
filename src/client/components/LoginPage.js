import React, { Component } from 'react'
import Nav from './Nav'

export default class LoginPage extends Component {
    constructor () {
        super()
    }

    render () {
        return (
            <div>
                <Nav />
                This is the login page
            </div>
        )
    }
}
