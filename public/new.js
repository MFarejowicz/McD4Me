$(document).ready(function(){

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyB3fxucYLqnzLwt62LII_oRb-WGl8cXPg0",
    authDomain: "mcd4-me.firebaseapp.com",
    databaseURL: "https://mcd4-me.firebaseio.com",
    projectId: "mcd4-me",
    storageBucket: "",
    messagingSenderId: "250979556000"
  };
  firebase.initializeApp(config);
  var ref = firebase.database().ref();

  // Sets a default for the time orders close
  function setTime() {
    var d = new Date();
    var m = d.getMinutes();
    var h = d.getHours();
    if(h<10){h='0'+h}
    if(m<10){m='0'+m}

    var currentTime = h+":"+m;
    $("#when").val(currentTime);
  }
  setTime();

  // Grabs the string from the orders-close input and makes it a usable time string
  function makeTimeString(time) {
    var h = parseInt(time.substring(0,2));
    var m = parseInt(time.substring(3));
    var s = 0
    var d = new Date();
    d.setHours(h, m, s);
    return d.toString();
  }

  // Creates a new room in the database, and redirects to the host page
  // corresponding to that room
  $("#create").click(function() {
    var place = $("#where").val();
    var time = $("#when").val();
    time = makeTimeString(time);
    var num = parseInt($("#maxNum").val());
    var rooms = ref.child("rooms");
    var newRef = rooms.push({
      closeTime: time,
      numLeft: num,
      place: place
    });
    var newKey = newRef.key;
    $(location).attr('href', 'host.html?room=' + newKey);
  });

});
