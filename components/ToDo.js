import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Button, AsyncStorage, Alert, Dimensions } from 'react-native';
import ToDoItem from './ToDoItem.js';
const controller = require('../controller/controller.js')


export default class ToDo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showComplete: true,
      items: [],
      uncommittedItems: []
    }
  }

  componentDidMount () {
    // load items and settings on mounting
    if (!this.props.firstTime) {
    this.loadItems()
    this.loadSettings()
    }
  }

  componentWillReceiveProps () {
    //handleconnectivity change???

  }

  reconcileDatabase = (uncommittedItems) => {
    uncommittedItems.forEach((item) => {
      controller.addItem(this.props.user, item)
    })
    this.setState((prevState) => {
      return {
        items: prevState.items.concat(uncommittedItems),
        uncommittedItems: []
      }
    })
  }

  // retrieve items from local storage and database, with local storage holding precedence
  loadItems = async () => {
    try {
      // retrieve all items from storage
      const itemsJSON = await AsyncStorage.getItem(`@MyStore:${this.props.user}/items`);
      const uncommittedItemsJSON = await AsyncStorage.getItem(`@MyStore:${this.props.user}/uncommittedItems`);

      // parse items and set state
      const items = JSON.parse(itemsJSON)
      const uncommittedItems = JSON.parse(uncommittedItemsJSON)


      // if there are uncommitted items, commit them to the db
      if (uncommittedItems && this.props.connected) this.reconcileDatabase(uncommittedItems)

      // get all items from database
      let getItemsFromDB = await controller.getAllItems(this.props.user)

      const dbItems = getItemsFromDB.filter((item) => {
        return item.hasOwnProperty('completed')
      })

      console.log('dbitems', getItemsFromDB)


      if (Array.isArray(items)) this.setState({items: items})
      if (Array.isArray(uncommittedItems)) this.setState({uncommittedItems: uncommittedItems})
      // if only the database is successful at retrieving items, use those
      else if (!items && !uncommittedItems && Array.isArray(dbItems)) {
        this.setState({items: dbItems})
      } // otherwise there are no files
      else if (!items && !uncommittedItems && !dbItems) {
        this.setState({items: []})
      }
    }
    catch (error) {
      Alert.alert('some sort of error retreiving to do list data - data may be incomplete', `error: ${error}`)
    }

  }

  // save both items and uncommitted items in storage
  saveItems = async () => {
   try {
      const itemsWithText = this.state.items.filter((item) => item.text !== null && item.text !== '')
      const uncommittedItemsWithText = this.state.uncommittedItems.filter((item) => item.text !== null && item.text !== '')
      await AsyncStorage.setItem(`@MyStore:${this.props.user}/items`, JSON.stringify(itemsWithText));
      await AsyncStorage.setItem(`@MyStore:${this.props.user}/uncommittedItems`, JSON.stringify(uncommittedItemsWithText));
    }
    catch (error) {
      Alert.alert('todo list not saved', `${error}`)
    }
  }

  // load settings from local storage
  loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(`@MyStore:${this.props.user}/settings`);
      let newSettings = JSON.parse(settings)
      this.setState({showComplete: newSettings})
    }
    catch (error) {
      console.log('error retrieving settings', `${error}`)
    }
  }

  // save settings to local storage
  saveSettings = async () => {
    try {
      await AsyncStorage.setItem(`@MyStore:${this.props.user}/settings`, JSON.stringify(this.state.showComplete));
    }
    catch (error) {
      console.log('todo list not saved', `${error}`)
    }
  }

  addBlankItem = async () => {
    const date = new Date()
    const newItem = {
      date: date,
      completed: false,
      text: null
    }
    if (this.props.connected) {
      await controller.addItem(this.props.user, newItem)
       await this.setState((prevState) => {
        return {items: prevState.items.concat([newItem])}
      })

    }
    else {
       await this.setState((prevState) => {
        return {uncommittedItems: prevState.uncommittedItems.concat([newItem])}
      })
    }
  }

  toggleShowComplete = async () => {
    await this.setState((prevState) => {
      return {showComplete: !prevState.showComplete}
    })
    this.saveSettings()
  }

// -----------------------------------
// functions to be passed to toDoItems
// -----------------------------------



  editItem = async (text, idx) => {
    console.log(idx)
    if (idx <= this.state.items.length - 1) {
      this.setState((prevState) => {
      let newItems = prevState.items.map((item, i) => {
        if (i === idx) {
            item.text = text
            controller.editItem(this.props.user, item)
        }
        return item
      }).filter((item) => item.text !== null && item.text !== '')
      return {items: newItems}
    })
    }
    else {

      await this.setState((prevState) => {
        let newItems = prevState.uncommittedItems.map((item, i) => {
          const indexOffset = this.state.items.length
          if (i === idx - indexOffset) item.text = text
          return item
        }).filter((item) => item.text !== null && item.text !== '')
        return {uncommittedItems: newItems}

      })
    }

    this.saveItems()

  }

  deleteItem = async (idx) => {
      if (idx <= this.state.items.length - 1) {
        controller.deleteItem(this.props.user, this.state.items[idx].firebaseKey)
        await this.setState((prevState) => {
          const newItems = prevState.items.filter((item, i) => i !== idx)
          return {items: newItems}
        })
      }
      else {
        await this.setState((prevState) => {
          const indexOffset = this.state.items.length
          const newItems = prevState.uncommittedItems.filter((item, i) => i !== idx - indexOffset)
          return {uncommittedItems: newItems}
        })
      }
      this.saveItems()
  }

  toggleComplete = async (idx) => {
    if (idx <= this.state.items.length - 1) {
      await this.setState((prevState) => {
        const items = prevState.items.map((item, i) => {
          if (idx === i) {
          item.completed = !item.completed
          controller.editItem(this.props.user, item)
        }
          return item
        })
        return {items: items}
      })
    }
    else {
      await this.setState((prevState) => {
       const items = prevState.uncommittedItems.map((item, i) => {
          const indexOffset = this.state.uncommittedItems.length - 1
          if (idx === i + indexOffset) item.completed = !item.completed
          return item
        })
        return {uncommittedItems: items}
      })
    }
    this.saveItems()
  }

// -----------------------
// end toDoItems functions
// -----------------------

  render () {

    let cells

    if (this.state.items.length > 0 || this.state.uncommittedItems.length > 0) {
    let allItems = []
    this.state.items.forEach((item) => allItems.push(item))
    this.state.uncommittedItems.forEach((item) => allItems.push(item))



      let items = allItems.map((item, i) => {
        item.idx = i
        return item
      })

      if (!this.state.showComplete) {
        items = items.filter((item) =>{ return !item.completed})
      }

      cells = items.map((item, i) => {
        return (<ToDoItem
                        {...item}
                        key={i}
                        toggleComplete={this.toggleComplete}
                        editItem={this.editItem}
                        deleteItem={this.deleteItem}
                      />
        )
      })
    }
    else if (this.state.items.length === 0 && this.state.uncommittedItems.length === 0) {
      cells = (<Text>You have nothing to do!</Text>)
    }

    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <Button title="Add New" onPress={this.addBlankItem} />
          <Button title={this.state.showComplete ? 'Hide Completed' : 'Show Completed'} onPress={this.toggleShowComplete} />
          <Button title="Log Out" onPress={this.props.logOut} />
        </View>
        <ScrollView style={styles.FlatList} keyboardShouldPersistTaps="always">
          {cells}
        </ScrollView>
      </View>
      )

  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 80,
    width: Dimensions.get('window').width,
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 2
  },
  FlatList: {
    flex: 1,
    width: Dimensions.get('window').width
      },
  topBar: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 2
  }
});
