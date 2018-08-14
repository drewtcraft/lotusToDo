import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default class ToDoItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      editing: false,
      editingText: ''
    }
  }

  toggleEditingMode = () => {
    console.log(this.props)
    this.setState((prevState)=>{
      if (this.props.text !== null) {
        return {
        editing: !prevState.editing,
        editingText: this.props.text
        }
      }
      return {
        editing: !prevState.editing
      }
    })
  }

  editText = (text) => {
    this.setState({editingText: text})
  }

  saveEdits = (text, idx) => {
    this.props.editItem(text, idx)
    this.toggleEditingMode()
  }

  render () {
    if (this.state.editing || this.props.text === null) {
      return (
        <View>
          <TextInput onChangeText={(text) => this.editText(text)} value={this.state.editingText} />
          <Button title="done" onPress={()=>{this.saveEdits(this.state.editingText, this.props.idx)}} />
        </View>
      )
    }

    return (
        <View>
          <View style={styles.container}>
            <Button
              title={this.props.complete ? '☒' : '☐'}
              onPress={()=>{this.props.toggleComplete(this.props.idx)}}
            />
            <Text>{this.props.text}</Text>
          </View>
          <View style={styles.container}>
            <Button title="edit" onPress={this.toggleEditingMode} />
            <Button title="delete" onPress={()=>{this.props.deleteItem(this.props.idx)}} />
          </View>
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
