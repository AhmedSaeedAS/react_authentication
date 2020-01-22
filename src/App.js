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

  editItemToFireBase = async (prop) => {
    debugger
    const data = await axios.get("/Images.json")
    const upload = { [prop.itemKey]: prop.itemValue }
    const order = { ...data.data, ...upload }
    const response = await axios.put("/Images.json", order)
    console.log(response)
  }

  uploadItemToFirebase = async (prop) => {
    let count = 0
    const data = await axios.get("/Images.json")
    if (data.data) {
      count = (Object.values(data.data).length)
    }
    const title = prop.itemKey + (count + 1);
    const upload = { [title]: prop.itemValue }
    // const upload = { [i]: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoAQMAAAB3bUanAAAABlBMVEX///8AAABVwtN+AAADWUlEQVR4nO3csXGjQBSAYTQKFKoElaLS5NIohRIcOrg57pY5wO/2gVFgD2i+P0Jodz9Id4CmkSRJkiRJktIu/ReF0ady5r0cPapBw0rtOGitlk6n0+l0Op1Op9PpdDqdfgS9bdJu+cLv4//n8qsrR+Xgo77EugudTqfT6XQ6nU6n0+l0Ov1Qetxp+hX0pMc4qG7TxhadTqfT6XQ6nU6n0+l0Ov3w+iX8lyxcSvas6HQ6nU6n0+l0Op1Op9Ppr6wP3f/++N18Lj7p1IeV6HQ6nU6n0+l0Op1Op9PpL6En3cKcftSvYc1J/9638+h0Op1Op9PpdDqdTqfT6T+urxXmxO2o5HGoadBadDqdTqfT6XQ6nU6n0+n0vevbu4cV3sbTtf4t0el0Op1Op9PpdDqdTqfTf1Jf2LOat6NC85NORT9P58MlJoO6cqocfNDpdDqdTqfT6XQ6nU6n0w+jt036fFKXD4ofTIqD6kuco9PpdDqdTqfT6XQ6nU6nH0uPlTnJdlQT9Fi9SFypC4NaOp1Op9PpdDqdTqfT6XT6UfSl55OmQfOc0qP/9zjUpE/bUcmnlyJHp9PpdDqdTqfT6XQ6nU4/lh679WnJt7in2lyvB9HpdDqdTqfT6XQ6nU6n0w+mT3OGkjlbevKbTnQ6nU6n0+l0Op1Op9Pp9P3pbT6nbn4cqs8vsb6PPuj/3QedTqfT6XQ6nU6n0+l0On3n+tJbbeX0sNN0D8Tb+P+t/KrvY2r1TTs6nU6n0+l0Op1Op9PpdPrO9blHYOpB16DHlerm9+OqGXQ6nU6n0+l0Op1Op9Pp9L3qm5oWfuIhpvw+6HQ6nU6n0+l0Op1Op9Pph9AXdprinEQvnetBRY/PTCW1dDqdTqfT6XQ6nU6n0+n0I+htk3YbFx66B31auCu/koU3DaLT6XQ6nU6n0+l0Op1Op+9cP/Wfi2+1JXtWjzDoueh0Op1Op9PpdDqdTqfT6a+jz3NWuo8LxK96x0uk0+l0Op1Op9PpdDqdTqe/jl4a9qyuYdBQvXD8YPfSfdDpdDqdTqfT6XQ6nU6n03euJy3MWVu4vsShboGj0+l0Op1Op9PpdDqdTqfvWF/rK73utL4gnU6n0+l0Op1Op9PpdDp9/7okSZIkSZK0o/4Anx8sLwV7p8oAAAAASUVORK5CYII=')" }
    const order = { ...data.data, ...upload }
    const response = await axios.put("/Images.json", order)
    console.log(response)
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

  pro = { itemKey: "image1", itemValue: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoAQMAAAB3bUanAAAABlBMVEX///8AAABVwtN+AAADWUlEQVR4nO3csXGjQBSAYTQKFKoElaLS5NIohRIcOrg57pY5wO/2gVFgD2i+P0Jodz9Id4CmkSRJkiRJktIu/ReF0ady5r0cPapBw0rtOGitlk6n0+l0Op1Op9PpdDqdfgS9bdJu+cLv4//n8qsrR+Xgo77EugudTqfT6XQ6nU6n0+l0Ov1Qetxp+hX0pMc4qG7TxhadTqfT6XQ6nU6n0+l0Ov3w+iX8lyxcSvas6HQ6nU6n0+l0Op1Op9Ppr6wP3f/++N18Lj7p1IeV6HQ6nU6n0+l0Op1Op9PpL6En3cKcftSvYc1J/9638+h0Op1Op9PpdDqdTqfT6T+urxXmxO2o5HGoadBadDqdTqfT6XQ6nU6n0+n0vevbu4cV3sbTtf4t0el0Op1Op9PpdDqdTqfTf1Jf2LOat6NC85NORT9P58MlJoO6cqocfNDpdDqdTqfT6XQ6nU6n0w+jt036fFKXD4ofTIqD6kuco9PpdDqdTqfT6XQ6nU6nH0uPlTnJdlQT9Fi9SFypC4NaOp1Op9PpdDqdTqfT6XT6UfSl55OmQfOc0qP/9zjUpE/bUcmnlyJHp9PpdDqdTqfT6XQ6nU4/lh679WnJt7in2lyvB9HpdDqdTqfT6XQ6nU6n0w+mT3OGkjlbevKbTnQ6nU6n0+l0Op1Op9Pp9P3pbT6nbn4cqs8vsb6PPuj/3QedTqfT6XQ6nU6n0+l0On3n+tJbbeX0sNN0D8Tb+P+t/KrvY2r1TTs6nU6n0+l0Op1Op9PpdPrO9blHYOpB16DHlerm9+OqGXQ6nU6n0+l0Op1Op9Pp9L3qm5oWfuIhpvw+6HQ6nU6n0+l0Op1Op9Pph9AXdprinEQvnetBRY/PTCW1dDqdTqfT6XQ6nU6n0+n0I+htk3YbFx66B31auCu/koU3DaLT6XQ6nU6n0+l0Op1Op+9cP/Wfi2+1JXtWjzDoueh0Op1Op9PpdDqdTqfT6a+jz3NWuo8LxK96x0uk0+l0Op1Op9PpdDqdTqe/jl4a9qyuYdBQvXD8YPfSfdDpdDqdTqfT6XQ6nU6n03euJy3MWVu4vsShboGj0+l0Op1Op9PpdDqdTqfvWF/rK73utL4gnU6n0+l0Op1Op9PpdDp9/7okSZIkSZK0o/4Anx8sLwV7p8oAAAAASUVORK5CYII=')" }

  render() {
    return (
      !localStorage.getItem("token") ? <div className="App" >
        <input placeholder="email" type="email" onChange={(e) => this.setEmailHandler(e)} />
        <input placeholder="password" type="password" onChange={(e) => { this.setPwdHandler(e) }} />
        <button onClick={this.signIn}>Submit</button>
      </div> : <div> <button onClick={this.loadImageText}>Load Text</button><button onClick={() => this.uploadItemToFirebase(this.pro)}>Image Count</button> <button onClick={this.signOut}>Log Out</button></div >
    );
  }
}
export default App;
