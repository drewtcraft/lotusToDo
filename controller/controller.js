import firebase from '../db/connection.js';

// helper function for creating refs
function makeRef(user, key) {
  if (key) return firebase.database().ref().child(`users/${user}/${key}`)
  return firebase.database().ref().child(`users/${user}/`)
}

module.exports = {

  addItem (user, item) {
    const ref = makeRef(user)
    const key = ref.push().key

    // add firebase key to item so it can use it in editing/deleting
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
    // return promise so I can actually get at this data
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
  }


}
