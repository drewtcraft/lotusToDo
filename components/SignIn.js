import React, {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default class SignIn extends Component {
  constructor (props) {
    super(props);
  }



  render () {
    return (
      <View style={styles.container}>
        <Button title="log in with facebook" onPress={()=>{console.log('x')}} />
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '20%',
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
