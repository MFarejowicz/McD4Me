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

  // Sets a default for the time orders close
  function setTime() {
    let currentDate = new Date(); // Default end is current time + 15 minutes
    let defaultEndDate = new Date(currentDate.getTime() + 15 * 60000);
    let m = defaultEndDate.getMinutes();
    let h = defaultEndDate.getHours();
    if (h < 10) { h = `0${h}`; }
    if (m < 10) { m = `0${m}`; }

    let defaultEndTime = `${h}:${m}`;
    $('#when').val(defaultEndTime);
  }
  setTime();

  // Grabs the string from the orders-close input and makes it a usable time string
  function makeTimeString(time) {
    let h = parseInt(time.substring(0,2), 10);
    let m = parseInt(time.substring(3), 10);
    let s = 0;

    let userEndDate = new Date();
    userEndDate.setHours(h, m, s);
    return userEndDate.toString();
  }

  // Checks to see if a value is a number. Useful for filtering out non numbers
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
  }

  // Creates a new room in the database, and redirects to the host page
  // corresponding to that room
  function handleCreate() {
    let place = $('#where').val();
    let time = $('#when').val();
    time = makeTimeString(time);
    let num = parseInt($('#maxNum').val(), 10);
    let pass = $('#pass').val();
    let rooms = ref.child('rooms');
    rooms.once('value')
      .then((snapshot) => {
        let existingRooms = Object.keys(snapshot.val());
        let filteredRooms = existingRooms.map((el) => parseInt(el, 10)).filter(isNumber);
        let nextRoomKey = Math.max(...filteredRooms) + 1;
        let nextRoom = {};
        nextRoom[nextRoomKey] = {
          place: place,
          closeTime: time,
          numLeft: num,
          password: pass,
        }
        rooms.update(nextRoom);
        if (pass === '') {
          $(location).attr('href', `host.html?room=${nextRoomKey}`);
        } else {
          $(location).attr('href', `host.html?room=${nextRoomKey}&pass=${pass}`);
        }
      });
  }

  // Bind creating a room to button click
  $('#create').click(() => {
    handleCreate();
  });

  // Bind creating a room to pressing enter
  $(document).keypress((key) => {
    if (key.keyCode === 13) {
      key.preventDefault();
      handleCreate();
    }
  });
});
