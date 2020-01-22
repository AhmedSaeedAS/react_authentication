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

  setUser = (user) => {
    this.setState({ loggedInUser: user })
  }

  signOut = () => {
    let context = this;

    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log("Sign-out successful.")
      context.setUser("")
      console.log()
    }).catch(function (error) {
      // An error happened.
    });
  }
  count = 0;

  signIn = async () => {
    let context = this
    const credentials = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4mYvAgHsI_BhSZIIEVpNrlDVJZYqcHLQ", credentials)
      .then(res => {
        return (context.setUser(res),
          console.log(res))
      })
      .catch(err =>
        console.log(err))
    // firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    //   .then(
    //     firebase.auth().onAuthStateChanged(function (user) {
    //       debugger
    //       context.count = context.count + 1
    //       if (user) {
    //         context.count = 0
    //         context.setUser(user)
    //         alert("sign In")
    //       }
    //       if (context.count > 0 && context.count < 3) {
    //         context.signIn()
    //       }
    //     }))
    //   .catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     console.log(errorCode)
    //     var errorMessage = error.message;
    //     console.log(errorMessage)
    //     return
    //   });
  }


  loadImage = async () => {
    axios.get("/ImagesText.json?auth=" + this.state.loggedInUser.data.idToken).then(res =>
      (
        // localStorage.setItem('imagesText', JSON.stringify(res.data)),
        // this.setState(res.data)
        console.log(JSON.stringify(res.data))
      )
    ).catch(err => (console.log(err)))
  }

  render() {

    return (
      this.state.loggedInUser === "" ? <div className="App" >
        <input placeholder="email" type="email" onChange={(e) => this.setEmailHandler(e)} />
        <input placeholder="password" type="password" onChange={(e) => { this.setPwdHandler(e) }} />
        <button onClick={this.signIn}>Submit</button>
      </div> : <div> <button onClick={this.loadImage}>Load Text</button> <button onClick={this.signOut}>Log Out</button></div>
    );
  }
}
export default App;
