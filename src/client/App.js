import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import WelcomePage from './components/WelcomePage'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import UserPage from './components/UserPage'
import './css/index.styl'

class App extends Component {
	constructor () {
		super()
	}

	render () {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/" exact render={() => (
						<WelcomePage />
					)} />
					<Route path="/login" render={() => (
						<LoginPage />
					)} />
					<Route path="/register" render={() => (
						<RegisterPage />
					)} />
					<Route path="/user" render={() => (
						<UserPage />
					)} />
				</Switch>
			</BrowserRouter>
		)
	}
}

ReactDOM.render(
	<App />,
	document.querySelector('#root')
)
