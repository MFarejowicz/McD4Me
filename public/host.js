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

  // Used to get room ID from url
  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // Used to round values
  function round(value) {
    return parseFloat(value.toFixed(2));
  }

  // The below occurs on load and whenever orders are updated, it gets
  // a snapshot of the database, updates fields at the top, and triggers
  // the function that fills content
  var room = getParameterByName("room");
  if (room){
    var roomLink = "https://mcd4-me.firebaseapp.com/order.html?room=" + room;
    $("#h-roomLink").html('<a href="' + roomLink + '">' + roomLink + '</a>');
    var roomRef = ref.child("rooms").child(room);

    roomRef.on("value", function(snapshot) {
      var status = snapshot.val();
      var closeTime = new Date(status.closeTime);
      var now = Date.now();
      var diff = round((closeTime - now)/1000/60);

      $("#h-numLeft").text(status.numLeft);
      $("#h-timeLeft").text(diff);
      fillHostPage(status);
    });
  }

  // The below increases the max limit for orders
  $("#h-increase").click(function() {
    roomRef.once("value").then(function(snapshot) {
      var status = snapshot.val();
      var numLeft = status.numLeft;
      roomRef.update({numLeft: numLeft + 1});
    });
  })

  // The below takes the snapshot of the database and uses it to fill out
  // content in the page
  function fillHostPage(status) {
    $("#orderList").children().remove();
    var orders = status.orders;
    var index = 0, subTotal = 0, taxTip = 0, total = 0;
    for (var person in orders){
      var order = orders[person];
      $("#orderList").append("<div class='list-item'><p class='person'>" + order.name + "</p><div class='item-cluster' id='order"+index+"'></div></div>");
      for (var item of order.items){
        $("#order" + index).append("<div class='food-item'><div class='food-item-name'>" + item.name + "</div><div class='food-item-info'><div class='food-item-cost'>$" + item.itemCost + "</div><div class='food-item-amt'> Quantity: " + item.quantity + "</div></div><div> Special Instructions: " + (item.instructions == "" ? "None" : item.instructions) + "</div></div>");
      }
      $("#order" + index).append("<div>Total after tax and delivery: $" + order.total + "</div>");
      subTotal += order.subTotal;
      taxTip += order.taxTip;
      total += order.total;
      index ++;
    }
    $("#h-subtotal").text(round(subTotal));
    $("#h-taxtip").text(round(taxTip));
    $("#h-total").text(round(total));
  }

});
