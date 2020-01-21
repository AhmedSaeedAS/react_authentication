import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    email: "",
    password: "",
    loggedInUser: ""
  }

  render() {
    console.log(firebase.user, "FB")
    const setEmailHandler = (e) => {
      this.setState({ email: e.target.value })
    }
    const setPwdHandler = (e) => {
      this.setState({ password: e.target.value })
    }

    const setUser = (user) => {
      this.setState({ loggedInUser: user })
    }

    const signIn = () => {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(
          //   if (e.user)
          //     setUser(e.user)
          //   alert("Sign In")
          // })
          firebase.auth().onAuthStateChanged(function (user) {
            debugger
            if (user) {
              setUser(user)
              alert("sign In")
            }
            else {
              return
            }
          }))
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          console.log(errorCode)
          var errorMessage = error.message;
          console.log(errorMessage)
          return
        });
    }

    const signOut = () => {
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("Sign-out successful.")
        setUser("")
      }).catch(function (error) {
        // An error happened.
      });
    }

    return (
      this.state.loggedInUser === "" ? <div className="App" >
        <input placeholder="email" type="email" onChange={(e) => setEmailHandler(e)} />
        <input placeholder="password" type="password" onChange={(e) => { setPwdHandler(e) }} />
        <button onClick={() => signIn()}>Submit</button>
      </div> : <button onClick={() => signOut()}>Log Out</button>
    );
  }
}
export default App;
