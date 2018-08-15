import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions } from 'react-native';

export default class ToDoItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      editing: false,
      editingText: ''
    }
  }

  toggleEditingMode = () => {
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
    // to-do item form for editing
    if (this.state.editing || this.props.text === null) {
      return (
        <View keyboardShouldPersistTaps="always" style={styles.row}>
          <View  style={styles.container}>
            <TextInput  style={styles.input} onChangeText={(text) => this.editText(text)} value={this.state.editingText} />
          </View>
          <View style={styles.container}>
          <Button keyboardShouldPersistTaps="always" title="done" onPress={()=>{this.saveEdits(this.state.editingText, this.props.idx)}} />
          </View>
        </View>
      )
    }

    // to-do item normal display
    return (
        <View style={styles.row}>
          <View style={styles.container}>
            <Button
              title={this.props.completed ? '☒' : '☐'}
              onPress={()=>{this.props.toggleComplete(this.props.idx)}}
            />
            <Text>{this.props.text}</Text>
          </View>
          <View style={styles.container2}>
            <Button title="edit" onPress={this.toggleEditingMode} />
            <Button title="delete" onPress={()=>{this.props.deleteItem(this.props.idx)}} />
          </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container2: {
    height: 30,
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  row : {
    height: 60,
    width: Dimensions.get('window').width,
    borderStyle: 'solid',
    borderColor: '#aaa',
    borderBottomWidth: 1
  },
  input: {
    width: '90%',
    padding: "2.5%",
    marginLeft: '2.5%',
    height: 30,
    backgroundColor: '#eee'
  }
});
