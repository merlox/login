import React, { Component } from 'react'

export default class UserPage extends Component {
    constructor () {
        super()

        this.state = {
            email: ''
        }
    }

    render () {
        return (
            <div className="page register-page">
                <h1>Welcome {this.state.email}!</h1>
            </div>
        )
    }
}
