import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';



export default class SignIn extends Component {
  constructor (props) {
    super(props);
  }

  componentWillUnmount () {
    // turn off loading screen when login is finished
    this.props.toggleLoadingScreen()
  }

  render () {
    if (!this.props.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Lotus To-Do</Text>
          <TouchableOpacity onPress={this.props.login} >
            <Text style={styles.fbButton}>log in using facebook</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (<View style={styles.container}><Text>Loading ...</Text></View>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbButton: {
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#3B5998',
    color: '#fff',
    padding: 20,
    fontSize: 20,
    fontWeight: "500"

  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 50
  }
});
