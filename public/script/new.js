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
    const currentDate = new Date(); // Default end is current time + 15 minutes
    const defaultEndDate = new Date(currentDate.getTime() + 15 * 60000);
    let m = defaultEndDate.getMinutes();
    let h = defaultEndDate.getHours();
    if (h < 10) { h = `0${h}`; }
    if (m < 10) { m = `0${m}`; }

    const defaultEndTime = `${h}:${m}`;
    $('#when').val(defaultEndTime);
  }
  setTime();

  // Grabs the string from the orders-close input and makes it a usable time string
  function makeTimeString(time) {
    const h = parseInt(time.substring(0, 2), 10);
    const m = parseInt(time.substring(3), 10);
    const s = 0;

    const userEndDate = new Date();
    userEndDate.setHours(h, m, s);
    const now = new Date();
    if (userEndDate < now) {
      userEndDate.setDate(userEndDate.getDate() + 1);
    }
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

    const rooms = ref.child('rooms');
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
        if (pass) {
          localStorage.setItem(`pass${nextRoomKey}`, pass);
        }
        $(location).attr('href', `host.html?room=${nextRoomKey}`);
      });
  }

  // Turn the time in the DB into a usable JavaScript Date object
  function makeTimeObject(time) {
    const h = parseInt(time.substring(0, 2), 10);
    const m = parseInt(time.substring(3, 5), 10);
    const s = parseInt(time.substring(6), 10);

    const timeObject = new Date();
    timeObject.setHours(h, m, s);
    return timeObject;
  }

  // Check to see if the current time is within the open ranges of a restaurant
  function isReasonableTime(now, todayHours) {
    for (let i = 0; i < todayHours.length; i += 1) {
      const range = todayHours[i];
      const start = makeTimeObject(range.start);
      const end = makeTimeObject(range.end);
      if (start < now && now < end) {
        return true;
      }
    }
    return false;
  }

  // Get the closing time of a restaurant as a string
  function getEndTime(hours) {
    const dbEndTime = makeTimeObject(hours[0].end);
    const actualEndTime = new Date(dbEndTime.getTime() + 30 * 60000);
    return actualEndTime.toLocaleTimeString();
  }

  // Check to make sure the currently selected restaurant is still open
  function checkTime() {
    const place = $('#where').val();
    const placeMap = {
      mcd: 'McDonald\'s',
      beantown: 'Beantown',
      dp: 'Dumpling Palace',
      kft: 'Kung Fu Tea',
      cafe: 'Cafe 472',
      bonchon: 'Bonchon',
      pepper: 'Pepper Sky',
      gongcha: 'Gong Cha',
    };
    const now = new Date();
    const day = now.getDay();

    const hoursRef = ref.child(`hours/${place}`);
    hoursRef.once('value')
      .then((snapshot) => {
        const hours = snapshot.val();
        const todayHours = hours[day];
        if (isReasonableTime(now, todayHours)) {
          $('#close-warning-res').text('');
          $('#close-warning-time').text('');
          $('.close-warning').css('display', 'none');
        } else {
          $('#close-warning-res').text(placeMap[place]);
          $('#close-warning-time').text(getEndTime(todayHours));
          $('.close-warning').css('display', 'block');
        }
      });
  }

  // Bind changing restaurant selection to checking restaurant hours
  $('#where').change(() => {
    checkTime();
  });
  checkTime(); // Also do this right when we load the page

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
