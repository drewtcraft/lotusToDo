import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ToDo from './components/ToDo.js';
import SignIn from './components/SignIn.js';


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null
    }
  }

  setUser = (user) => {
    this.setState({user: user})
  }

  render() {
    if (this.state.user) {
    return (
        <ToDo />
    );
  }

  return (
    <ToDo />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

