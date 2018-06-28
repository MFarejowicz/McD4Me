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

  // Handle clicking the join button and making the room textbox appear
  $("#join").click(function(){
    $(".to-join").toggle(500);
  });

  // Handle entering a room after typing in the room code and hitting the join button
  $("#join-butt").click(function() {
    var roomToJoin = $("#join-text").val();
    var rooms = ref.child("rooms");
    rooms.once("value").then(function(snapshot) {
      var status = snapshot.val();
      var prevRooms = [];
      Object.keys(status).forEach(function(key) {
        prevRooms.push(key);
      });
      if (prevRooms.includes(roomToJoin)) {
        $(location).attr('href', 'order.html?room=' + roomToJoin);
      } else {
        alert("This room does not exist");
      }
    });
  });

});
