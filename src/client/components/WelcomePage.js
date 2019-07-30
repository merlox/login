import React, { Component } from 'react'
import Nav from './Nav'

export default class WelcomePage extends Component {
    constructor () {
        super()
    }

    render () {
        return (
            <div>
                <Nav />
                This is the welcome page
            </div>
        )
    }
}
