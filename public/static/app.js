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

  var url = "./static/menus/mcd.json";

  $.getJSON(url, doActions);

  function doActions(data) {
    makeMenu(data);
    handleToggle();
    takeOrder();
  }

  function makeMenu(data){
    var menuItems = data;
    var groups = [];
    for (var item of menuItems) {
      if (!(groups.includes(item.group))) {
        groups.push(item.group);
        $("#menu").append("<div><p data-group='" + item.group + "' class='menu-group-title'>" + item.group + " + </p><div data-group='" + item.group + "' style='display: none'></div></div>");
      }
      $("div[data-group='" + item.group + "']").append("<div class='menu-item'><input id='" + item.id + "' type='checkbox'></input><label for='" + item.id + "'>$" + item.price + " - " + item.name + "</label></div>");
      $("#" + item.id).data(item);
    }
  }

  function handleToggle() {
    $("p[data-group]").click(function(){
      var group = $(this).attr("data-group");
      $("div[data-group='" + group + "']").toggle(500);
    });
  }

  function takeOrder() {
    var order = {};
    order.items = [];
    order.totalCost = 0;
    $("input[type='checkbox'").click(function() {
      var el = this;
      var selector = $("#" + el.id);
      var itemData = selector.data();
      if (selector.is(":checked")) {
        $("#order").append("<div class='order-item' id='" + itemData.id + "'><div class='order-item-top'><span>$" + itemData.price + " - " + itemData.name +
          "</span><div class='quantity-div'><label for='" + itemData.id + "-amt'>Quantity: </label><input type='number' id='" +
          itemData.id + "-amt' class='quantity-input' value='1' min='1'></input></div></div><div><span>Special Instructions:</span><textarea class='instr-text'></textarea></div></div>");
        var newItem = {};
        newItem[itemData.id] = {name: itemData.name, cost: itemData.price, quantity: 1, instructions: ""};
        order.items.push(newItem);
        // order.totalCost += itemData.price;
        // order.totalCost = round(order.totalCost);
      } else {
        $("div#" + itemData.id).remove();
        order.items = order.items.filter(item => item !== itemData.id);
        // order.totalCost -= itemData.price;
        // order.totalCost = round(order.totalCost);
      }
      // console.log(order);
      $(".quantity-input").bind('keyup mouseup', function () {
        var id = this.id;
        id = id.replace("-amt", "");
        var ind;
        for (var el in order.items){
          if (id == Object.keys(order.items[el])[0]) {
            ind = el;
            break;
          }
        }
        var val = parseInt($(this).val());
        if (val > 0 && val != order.items[ind][id].quantity){
          order.items[ind][id].quantity = val;
        }
        console.log(order);
      });
    });
  }


  function round(value) {
    return parseFloat(value.toFixed(2));
  }

  function setTime() {
    var d = new Date();
    var m = d.getMinutes();
    var h = d.getHours();
    if(d<10){d='0'+d}
    if(m<10){m='0'+m}

    var currentTime = h+":"+m;
    $("#when").val(currentTime);
  }
  setTime();

});

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
