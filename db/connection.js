const firebase = require('firebase')

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBg7ERnJ4gHQMjPUwN53J_ckfw_Pu2xQuc",
  authDomain: "lotustodoapp.firebaseapp.com",
  databaseURL: "https://lotustodoapp.firebaseio.com/",
  storageBucket: "lotustodoapp.appspot.com"
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase
