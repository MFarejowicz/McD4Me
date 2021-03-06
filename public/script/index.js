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

  // Handle entering a room after typing in the room code and
  // either hitting the join button or pressing enter
  function handleJoin() {
    let roomToJoin = $('#join-text').val();

    const existingRooms = ref.child('rooms');
    if (roomToJoin) {
      existingRooms.once('value')
        .then((snapshot) => {
          const status = snapshot.val();
          if (status.hasOwnProperty(roomToJoin)) {
            $(location).attr('href', `order.html?room=${roomToJoin}`);
          } else {
            $('#modal').css('display', 'block');
          }
        });
    }
  }

  // Bind joining to button click
  $('#join-butt').click(() => {
    handleJoin();
  });

  // Bind joining to pressing enter
  $(document).keypress((key) => {
    if ($('.to-join').css('display') === 'block' && key.keyCode === 13) {
      key.preventDefault();
      if ($('#modal').css('display') === 'block') {
        $('#modal').css('display', 'none');
      } else if ($('#modal').css('display') === 'none') {
        handleJoin();
      }
    }
  });

  // Bind closing the modal to clicking the 'X' in the modal
  $('.close-modal').click(() => {
    $('#modal').css('display', 'none');
  });

  // Bind closing the modal to clicking outside the modal
  $(window).click((evt) => {
    if (evt.target === $('#modal')[0]) {
      $('#modal').css('display', 'none');
    }
  });
});
