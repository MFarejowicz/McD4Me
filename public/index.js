$(document).ready(() => {
  // Initialize Firebase
  const config = {
    apiKey: 'AIzaSyB3fxucYLqnzLwt62LII_oRb-WGl8cXPg0',
    authDomain: 'mcd4-me.firebaseapp.com',
    databaseURL: 'https://mcd4-me.firebaseio.com',
    projectId: 'mcd4-me',
    storageBucket: '',
    messagingSenderId: '250979556000',
  };
  firebase.initializeApp(config);
  const ref = firebase.database().ref();

  // Handle clicking the join button and making the room textbox appear
  $('#join').click(() => {
    $('.to-join').toggle(500);
  });

  // Handle entering a room after typing in the room code and hitting the join button
  $('#join-butt').click(() => {
    let roomToJoin = $('#join-text').val();
    let existingRooms = ref.child('rooms');
    existingRooms.once('value')
      .then((snapshot) => {
        let status = snapshot.val();
        if (status.hasOwnProperty(roomToJoin)) {
          $(location).attr('href', `order.html?room=${roomToJoin}`);
        } else {
          alert('This room does not exist');
        }
      });
  });
});
