import firebase from '../db/connection.js';

function makeRef(user, key) {
  if (key) return firebase.database().ref().child(`users/${user}/${key}`)
  return firebase.database().ref().child(`users/${user}/`)
}

module.exports = {

  addItem (user, item) {
    const ref = makeRef(user)
    const key = ref.push().key
    item.firebaseKey = key
    let update = {}
    update[`${key}`] = item
    ref.update(update)
  },

  editItem (user, item) {
    const ref = makeRef(user)
    let update = {}
    update[`${item.firebaseKey}`] = item
    ref.update(update)
  },

  deleteItem (user, key) {
    const ref = makeRef(user, key)
    ref.remove()
  },

  getAllItems (user) {
    return new Promise ((resolve, reject) => {

    const ref = makeRef(user)
    ref.once('value').then((snapshot)=>{
      const x = snapshot.val()
      const snaps = Object.keys(x).map((snap) => {
        return x[snap]
      })
      resolve(snaps)
    })
  })









    // let items = []
    // const ref = makeRef(user)
    // ref.on('value', (snapshot) => {
    //   snapshot.forEach(  (snap) => {
    //     const x = snap.val()
    //     items.push(x)
    //   })
    // })

  }


}
