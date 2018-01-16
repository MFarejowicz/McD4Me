(function() {

  // Initialize Firebase
  const config = {
  apiKey: "AIzaSyCWNhabtGA9a9Zu-1FovZ39u9Y7Cl-C2BM",
  authDomain: "mcd4me-94dda.firebaseapp.com",
  databaseURL: "https://mcd4me-94dda.firebaseio.com",
  projectId: "mcd4me-94dda",
  storageBucket: "mcd4me-94dda.appspot.com",
  messagingSenderId: "988385113266"
  };
  firebase.initializeApp(config);

  const orderList = document.getElementById('test');
  const dbRefList = firebase.database().ref().child('orders');

  dbRefList.on('value', snap => console.log(snap.val()));

}());

// const express = require('express')
// const app = express()
//
// app.use(express.static('templates'))
// app.use('/static', express.static('static'))
//
// // 404
// app.get('*', function(req, res) {
//   res.send('oops 404')
// })
//
// app.listen(8080, () => console.log('Example app listening on port 8080!'))

// var d = new Date();
// var m = d.getMinutes();
// var h = d.getHours();
//
// var currentTime = h+":"+m;
// var timeControl = document.querySelector('input[type="time"]');
// if (timeControl) {
//   timeControl.value = currentTime;
// }
