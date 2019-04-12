import firebase from "firebase"
import React, { Component } from 'react'
import {StyledFirebaseAuth} from 'react-firebaseui'
import firebaseApp from "./firebaseApp";

const uiConfig = {
  signInFlow: 'redirect',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],

};

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

class Login extends Component {
  render() {
    return (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />
    );
  }
}

export default Login