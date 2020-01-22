import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import axios from './axios'

firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    email: "",
    password: "",
    loggedInUser: ""
  }

  setEmailHandler = (e) => {
    this.setState({ email: e.target.value })
  }
  setPwdHandler = (e) => {
    this.setState({ password: e.target.value })
  }

  signIn = async () => {
    let context = this;
    const credentials = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    }
    const login = await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4mYvAgHsI_BhSZIIEVpNrlDVJZYqcHLQ", credentials)
    localStorage.setItem("token", login.data.idToken)
    console.log(login);
    context.setUser(login);
  }
  signOut = () => {
    let context = this;
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log("Sign-out successful.")
      localStorage.removeItem("token")
      context.setUser("")
      console.log()
    }).catch(function (error) {
      // An error happened.
    });
  }

  setUser = (user) => {
    this.setState({ loggedInUser: user })
  }

  loadImageText = async () => {
    axios.get("/ImagesText.json?auth=" + localStorage.getItem("token")).then(res =>
      (
        console.log(JSON.stringify(res.data))
      )
    ).catch((err) => {
      if (err.response.status === 401) {
        this.signOut()
      }
    })
  }

  render() {

    return (
      !localStorage.getItem("token") ? <div className="App" >
        <input placeholder="email" type="email" onChange={(e) => this.setEmailHandler(e)} />
        <input placeholder="password" type="password" onChange={(e) => { this.setPwdHandler(e) }} />
        <button onClick={this.signIn}>Submit</button>
      </div> : <div> <button onClick={this.loadImageText}>Load Text</button> <button onClick={this.signOut}>Log Out</button></div>
    );
  }
}
export default App;
