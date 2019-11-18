import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import WelcomePage from './components/WelcomePage'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import UserPage from './components/UserPage'
import ResetPasswordForm from './components/ResetPasswordForm'
import './css/index.styl'

class App extends Component {
	constructor () {
		super()
	}

	redirectTo(history, location) {
		history.push(location);
	}

	render () {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/" exact render={context => (
						<WelcomePage
							history={context.history}
							redirectTo={(history, location) => {
							  this.redirectTo(history, location)
							}}
						/>
					)} />
					<Route path="/login" render={context => (
						<LoginPage
							history={context.history}
							redirectTo={(history, location) => {
							  this.redirectTo(history, location)
							}}
						/>
					)} />
					<Route path="/register" render={context => (
						<RegisterPage
							history={context.history}
              redirectTo={(history, location) => {
                this.redirectTo(history, location)
					  	}}
						/>
					)} />
					<Route path="/user" render={context => (
						<UserPage
							history={context.history}
							redirectTo={(history, location) => {
							  this.redirectTo(history, location)
							}}
						/>
					)} />
					<Route path="/reset-password-form" render={context => (
						<ResetPasswordForm
							history={context.history}
							redirectTo={(history, location) => {
								this.redirectTo(history, location)
							}}
						/>
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
