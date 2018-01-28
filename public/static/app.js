$(document).ready(function(){

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

  // var ref = firebase.database().ref();
  // var testRef = ref.child("test");
  //
  // const roomSpan = document.getElementById("roomNum");
  // const timeSpan = document.getElementById("timeLeft");
  // const orderList = document.getElementById("orderList");
  //
  // testRef.on("value", function(snap) {
  //   console.log(snap.val());
  //
  //   if (roomSpan) {
  //     roomSpan.innerText = "test";
  //   }
  //
  //   if (timeSpan) {
  //     var date = new Date(null);
  //     date.setSeconds(snap.val().time);
  //     var result = date.toISOString().substr(11, 8);
  //     timeSpan.innerText = result;
  //   }
  //
  //   for (var order in snap.val().orders) {
  //     console.log(snap.val().orders[order]);
  //   }
  //
  // });

  var url = "./static/menus/mcd.json";

  $.getJSON(url, order);

  function order(data) {
    var order = {};
    order.items = [];
    order.cost = 0;
    var menuItems = data;
    for (var key in menuItems) {
      // console.log(key);
      $("#menu").append("<p>"+key+"</p>");
      // console.log(menuItems[key]);
      if (menuItems[key].length > 0) {
        for (var item of menuItems[key]) {
          // console.log(item);
          $("#menu").append("<div class='menu-item'><input id='" + item.id + "' type='checkbox'></input>" + "<label for='" + item.id + "'>$" + item.price + " - " + item.name + "</label></div>");
          $("#" + item.id).data(item);
        }
      } else {
        $("#menu").append("<div> No items here </div>");
      }
    }
    $("input").click(function() {
      // console.log(this);
      var item = $("#" + this.id).data();
      // console.log(item);
      if ($('#' + this.id).is(":checked")) {
        $("#order").append("<div id=" + this.id + " class='menu-item'><span>$" + item.price + " - " + item.name + "</span></div>");
        order.items.push(this.id);
        order.cost += item.price;
        // console.log(order);
      } else {
        $("div#" + this.id).remove();
        order.items = order.items.filter(item => item !== this.id);
        order.cost -= item.price;
        // console.log(order);
      }
    });
  }


});


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
