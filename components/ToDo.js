import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Button, AsyncStorage, Alert } from 'react-native';
import ToDoItem from './ToDoItem.js';


export default class ToDo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showComplete: true,
      //mock items
      items: [ {text: 'hello world', date: new Date(), completed: false},
               {text: 'hello turds', date: new Date(), completed: false} ]
    }
  }

  componentDidMount () {
    this.loadItems()
  }

  componentDidUpdate (prevProps, prevState) {
    //if user logs out, or if items changes
    if (prevState.items !== this.state.items) {
      this.saveItems()
    }
  }

  loadItems = async () => {
    let items
    try {
      items = await AsyncStorage.getItem(`@MyStore:${this.props.user}/todo`);
      const newItems = JSON.parse(items)
      console.log(newItems)
      if (newItems !== null) this.setState({items: newItems})
      else {
        this.setState({items: []})
      }
    }
    catch (error) {
      Alert.alert('could not find items for user', error)
    }
  }

  saveItems = async () => {
   try {
      await AsyncStorage.setItem(`@MyStore:${this.props.user}/todo`, JSON.stringify(this.state.items));
    }
    catch (error) {
      console.log('todo list not saved', error)
    }
  }

  addBlankItem = () => {
    const date = new Date()
    const newItem = {
      date: date,
      completed: false,
      text: null
    }
    this.setState((prevState) => {
      return {items: prevState.items.concat([newItem])}
    })
  }

  toggleShowComplete = () => {
    this.setState((prevState) => {
      return {showComplete: !prevState.showComplete}
    })
  }

// -----------------------------------
// functions to be passed to toDoItems
// -----------------------------------

  editItem = (text, idx) => {
    this.setState((prevState) => {
      const newItems = prevState.items.map((item, i) => {
        if (i === idx) item.text = text
        return item
      })
      return {items: newItems}
    })
  }

  deleteItem = (idx) => {
    this.setState((prevState) => {
      const newItems = prevState.items.filter((item, i) => i !== idx)
      return {items: newItems}
    })
  }

  toggleComplete = (idx) => {
    this.setState((prevState) => {
      const items = prevState.items.map((item, i) => {
        if (idx === i) item.complete = !item.complete
        return item
      })
      return {items: items}
    })
  }

// -----------------------
// end toDoItems functions
// -----------------------

  render () {
    let items

    if (this.state.items.length > 0) {
      let filteredItems = this.state.items
      // only show incomplete tasks if user has hit
      if (!this.state.showComplete) filteredItems = this.state.items.filter(item => !item.complete)
      items = filteredItems.map((item, i) => {
        return (
          <ToDoItem
            {...item}
            idx={i}
            key={i}
            showComplete={this.state.showComplete}
            toggleComplete={this.toggleComplete}
            editItem={this.editItem}
            deleteItem={this.deleteItem}
          />
        )
      })
    }

    else {items = <Text>You have nothing to do!</Text>}

    return (
      <View>
        <View style={styles.container}>
          <Button title="Add New" onPress={this.addBlankItem} />
          <Button title={this.state.showComplete ? 'Hide Completed' : 'Show Completed'} onPress={this.toggleShowComplete} />
          <Button title="Log Out" onPress={()=>{}} />
        </View>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={true}>
          {items}
        </ScrollView>
      </View>
      )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    height: '100%'
  }
});
