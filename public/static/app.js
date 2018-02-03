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

  class Order {
    constructor() {
      this.name = "";
      this.items = [];
      this.subTotal = 0;
      this.taxTip = 0;
      this.total = 0;
    }
    getItems() {
      return this.items;
    }
    getCosts() {
      return {subTotal: this.subTotal, taxTip: this.taxTip, total: this.total};
    }
    addItem(id, name, price, quantity, instructions) {
      var newItem = {}
      newItem.id = id;
      newItem.name = name;
      newItem.price = price;
      newItem.quantity = quantity;
      newItem.itemCost = price * quantity;
      newItem.instructions = instructions;
      this.items.push(newItem)
      this.calculateCosts();
    }
    removeItem(id) {
      this.items = this.items.filter(item => item.id != id);
      this.calculateCosts();
    }
    changeQuantity(id, quantity) {
      var index = 0;
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
          index = i;
          break;
        }
      }
      if (quantity > 0 && quantity != this.items[index].quantity) {
        this.items[index].quantity = quantity;
        this.items[index].itemCost = this.items[index].price * this.items[index].quantity
        this.calculateCosts();
      }
    }
    changeInstructions(id, instructions) {
      var index = 0;
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
          index = i;
          break;
        }
      }
      this.items[index].instructions = instructions;
    }
    calculateCosts() {
      var subTotal = 0;
      for (var item of this.items) {
        subTotal += item.price * item.quantity;
      }
      this.subTotal = round(subTotal);
      this.taxTip = round(0.15 * this.subTotal);
      this.total = round(this.subTotal + this.taxTip);
    }
  }

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
    var order = new Order();
    $("input[type='checkbox'").click(function() {
      var el = this;
      var selector = $("#" + el.id);
      var itemData = selector.data();
      if (selector.is(":checked")) {
        $("#order").append("<div class='order-item' id='" + itemData.id + "'><div class='order-item-top'><span>$" + itemData.price + " - " + itemData.name +
          "</span><div class='remove-item' data-rem='" + itemData.id + "'><span>X</span></div></div><div class='quantity-div'><label for='" + itemData.id + "-amt'>Quantity: </label><input type='number' id='" +
          itemData.id + "-amt' data-amt='" + itemData.id + "' class='quantity-input' value='1' min='1'></input></div><div><span>Special Instructions:</span><textarea data-instr='" + itemData.id + "' class='instr-text'></textarea></div></div>");
        order.addItem(itemData.id, itemData.name, itemData.price, 1, "");
      } else {
        $("div#" + itemData.id).remove();
        order.removeItem(itemData.id);
      }
      updateCosts(order);
      $(".quantity-input").off().bind('keyup mouseup', function () {
        var elID = $(this).attr("data-amt");
        var amt = parseInt($(this).val());
        order.changeQuantity(elID, amt);
        updateCosts(order);
      });
      $(".instr-text").off().bind('keyup mouseup', function () {
        var elID = $(this).attr("data-instr");
        var instructions = $(this).val();
        order.changeInstructions(elID, instructions);
      });
      $(".remove-item").off().click(function() {
        var elID = $(this).attr("data-rem");
        $("div#" + elID).remove();
        $('#' + elID).prop('checked', false);
        order.removeItem(elID);
        updateCosts(order);
      });
    });
  }

  function updateCosts(order) {
    var costs = order.getCosts();
    $("#subtotal").text("$" + costs.subTotal);
    $("#taxtip").text("$" + costs.taxTip);
    $("#total").text("$" + costs.total);
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
