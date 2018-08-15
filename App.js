import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, NetInfo, AsyncStorage } from 'react-native';
import ToDo from './components/ToDo.js';
import SignIn from './components/SignIn.js';
import Loading from './components/Loading.js'
import { Facebook } from 'expo';
import firebase from './db/connection.js'



export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      connected: false,
      loading: false,
      firstTime: true
    }
  }

  componentDidMount () {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
  }

  checkForToken = async (user) => {
    try {
      const token = await AsyncStorage.getItem(`@MyStore:${user}token`);
      if (token) {
        this.setState({
          user: user,
          firstTime: false
        })
      }
      else {
        await AsyncStorage.setItem(`@MyStore:${user}token`, user);
        this.setState({user: user})
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  toggleLoadingScreen = () => {
    this.setState((prevState) => {
      return {loading: !prevState.loading}
    })
  }

  handleConnectionChange = (connected) => {
    if (connected) {
      this.setState({connected: true})
    } else {
      this.setState({connected: false})
    }
  }

  login = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('316723295553208', {
      permissions: ['public_profile'],
    });

    if (type, token) {

      this.toggleLoadingScreen()

      const credential = await firebase.auth.FacebookAuthProvider.credential(token);

      const user = await firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((err)=>{console.log(err)})

      this.checkForToken(user.user.uid)

    }
  }

  logOut = () => { this.setState({user:null}) }

  render() {

  if (this.state.user) {
      return (
        <ToDo
          logOut={this.logOut}
          user={this.state.user}
          style={styles.container}
          connected={this.state.connected}
          firstTime={this.state.firstTime}
        />
      )
    }
    return (
      <SignIn
        login={this.login}
        loading={this.state.loading}
        toggleLoadingScreen={this.toggleLoadingScreen}
      />
    )
    }



}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

