// $(document).ready(function(){

  // Initialize Firebase
  // const config = {
  //   apiKey: "AIzaSyB3fxucYLqnzLwt62LII_oRb-WGl8cXPg0",
  //   authDomain: "mcd4-me.firebaseapp.com",
  //   databaseURL: "https://mcd4-me.firebaseio.com",
  //   projectId: "mcd4-me",
  //   storageBucket: "",
  //   messagingSenderId: "250979556000"
  // };
  // firebase.initializeApp(config);
  // var ref = firebase.database().ref();

  // class Order {
  //   constructor() {
  //     this.name = "";
  //     this.items = [];
  //     this.subTotal = 0;
  //     this.taxTip = 0;
  //     this.total = 0;
  //   }
  //   setName(val) {
  //     this.name = val;
  //   }
  //   getName() {
  //     return this.name;
  //   }
  //   getItems() {
  //     return this.items;
  //   }
  //   getCosts() {
  //     return {subTotal: this.subTotal, taxTip: this.taxTip, total: this.total};
  //   }
  //   addItem(id, name, price, quantity, instructions) {
  //     var newItem = {}
  //     newItem.id = id;
  //     newItem.name = name;
  //     newItem.price = price;
  //     newItem.quantity = quantity;
  //     newItem.itemCost = price * quantity;
  //     newItem.instructions = instructions;
  //     this.items.push(newItem)
  //     this.calculateCosts();
  //   }
  //   removeItem(id) {
  //     this.items = this.items.filter(item => item.id != id);
  //     this.calculateCosts();
  //   }
  //   changeQuantity(id, quantity) {
  //     var index = 0;
  //     for (var i = 0; i < this.items.length; i++) {
  //       if (this.items[i].id == id) {
  //         index = i;
  //         break;
  //       }
  //     }
  //     if (quantity > 0 && quantity != this.items[index].quantity) {
  //       this.items[index].quantity = quantity;
  //       this.items[index].itemCost = this.items[index].price * this.items[index].quantity
  //       this.calculateCosts();
  //     }
  //   }
  //   changeInstructions(id, instructions) {
  //     var index = 0;
  //     for (var i = 0; i < this.items.length; i++) {
  //       if (this.items[i].id == id) {
  //         index = i;
  //         break;
  //       }
  //     }
  //     this.items[index].instructions = instructions;
  //   }
  //   calculateCosts() {
  //     var subTotal = 0;
  //     for (var item of this.items) {
  //       subTotal += item.price * item.quantity;
  //     }
  //     this.subTotal = round(subTotal);
  //     this.taxTip = round(0.15 * this.subTotal);
  //     this.total = round(this.subTotal + this.taxTip);
  //   }
  // }

  // Handle clicking the join button and making the room textbox appear
  // $("#join").click(function(){
  //   $(".to-join").toggle(500);
  // });

  // Handle entering a room after typing in the room code and hitting the join button
  // $("#join-butt").click(function() {
  //   var roomToJoin = $("#join-text").val();
  //   var rooms = ref.child("rooms");
  //   rooms.once("value").then(function(snapshot) {
  //     var status = snapshot.val();
  //     var prevRooms = [];
  //     Object.keys(status).forEach(function(key) {
  //       prevRooms.push(key);
  //     });
  //     if (prevRooms.includes(roomToJoin)) {
  //       $(location).attr('href', 'order.html?room=' + roomToJoin);
  //     } else {
  //       alert("This room does not exist");
  //     }
  //   });
  // });

  // var room = getParameterByName("room");
  // if (room){
  //   var roomLink = "https://mcd4-me.firebaseapp.com/order.html?room=" + room;
  //   $("#h-roomLink").html('<a href="' + roomLink + '">' + roomLink + '</a>');
  //   var roomRef = ref.child("rooms").child(room);
  //
  //   roomRef.on("value", function(snapshot) {
  //     var status = snapshot.val();
  //     $("#o-resName").text(status.place);
  //     $("#o-numLeft").text(status.numLeft);
  //     var closeTime = new Date(status.closeTime);
  //     var now = Date.now();
  //     var diff = round((closeTime - now)/1000/60);
  //     $("#o-closeTime").text(diff);
  //
  //     $("#h-numLeft").text(status.numLeft);
  //     $("#h-timeLeft").text(diff);
  //     fillHostPage(status);
  //   });
  //
  //   roomRef.once("value").then(function(snapshot) {
  //     var status = snapshot.val();
  //     if (status.place == "McDonald's"){
  //       var url = "./static/menus/mcd.json";
  //     }
  //     $.getJSON(url, doActions);
  //   });
  // }
  //
  // function fillHostPage(status) {
  //   $("#orderList").children().remove();
  //   var orders = status.orders;
  //   var index = 0, subTotal = 0, taxTip = 0, total = 0;
  //   for (var person in orders){
  //     var order = orders[person];
  //     $("#orderList").append("<div class='list-item'><p class='person'>" + order.name + "</p><div class='item-cluster' id='order"+index+"'></div></div>");
  //     for (var item of order.items){
  //       $("#order" + index).append("<div class='food-item'><div class='food-item-name'>" + item.name + "</div><div class='food-item-info'><div class='food-item-cost'>$" + item.itemCost + "</div><div class='food-item-amt'> Quantity: " + item.quantity + "</div></div><div> Special Instructions: " + (item.instructions == "" ? "None" : item.instructions) + "</div></div>");
  //     }
  //     $("#order" + index).append("<div>Total after tax and delivery: $" + order.total + "</div>");
  //     subTotal += order.subTotal;
  //     taxTip += order.taxTip;
  //     total += order.total;
  //     index ++;
  //   }
  //   $("#h-subtotal").text(round(subTotal));
  //   $("#h-taxtip").text(round(taxTip));
  //   $("#h-total").text(round(total));
  // }

  // function increaseOrderLimit() {
  //   $("#h-increase").click(function() {
  //     roomRef.once("value").then(function(snapshot) {
  //       var status = snapshot.val();
  //       var numLeft = status.numLeft;
  //       roomRef.update({numLeft: numLeft + 1});
  //     });
  //   })
  // }
  // increaseOrderLimit();

  // function doActions(data) {
  //   makeMenu(data);
  //   handleToggle();
  //   takeOrder();
  // }

  // function makeMenu(data){
  //   var menuItems = data;
  //   var groups = [];
  //   for (var item of menuItems) {
  //     if (!(groups.includes(item.group))) {
  //       groups.push(item.group);
  //       $("#menu").append("<div><p data-group='" + item.group + "' class='menu-group-title'>" + item.group + " + </p><div data-group='" + item.group + "' style='display: none'></div></div>");
  //     }
  //     $("div[data-group='" + item.group + "']").append("<div class='menu-item'><input id='" + item.id + "' type='checkbox'></input><label for='" + item.id + "'>$" + item.price + " - " + item.name + "</label></div>");
  //     $("#" + item.id).data(item);
  //   }
  // }
  //
  // function handleToggle() {
  //   $("p[data-group]").click(function(){
  //     var group = $(this).attr("data-group");
  //     $("div[data-group='" + group + "']").toggle(500);
  //   });
  // }

  // function takeOrder() {
  //   var order = new Order();
  //   $("#name").off().bind('keyup mouseup', function () {
  //     var val = $(this).val();
  //     order.setName(val);
  //   });
  //   $("input[type='checkbox'").click(function() {
  //     var el = this;
  //     var selector = $("#" + el.id);
  //     var itemData = selector.data();
  //     if (selector.is(":checked")) {
  //       $("#order").append("<div class='order-item' id='" + itemData.id + "'><div class='order-item-top'><span>$" + itemData.price + " - " + itemData.name +
  //         "</span><div class='remove-item' data-rem='" + itemData.id + "'><span>X</span></div></div><div class='quantity-div'><label for='" + itemData.id + "-amt'>Quantity: </label><input type='number' id='" +
  //         itemData.id + "-amt' data-amt='" + itemData.id + "' class='quantity-input' value='1' min='1'></input></div><div><span>Special Instructions:</span><textarea data-instr='" + itemData.id + "' class='instr-text'></textarea></div></div>");
  //       order.addItem(itemData.id, itemData.name, itemData.price, 1, "");
  //     } else {
  //       $("div#" + itemData.id).remove();
  //       order.removeItem(itemData.id);
  //     }
  //     updateCosts(order);
  //     $(".quantity-input").off().bind('keyup mouseup', function () {
  //       var elID = $(this).attr("data-amt");
  //       var amt = parseInt($(this).val());
  //       order.changeQuantity(elID, amt);
  //       updateCosts(order);
  //     });
  //     $(".instr-text").off().bind('keyup mouseup', function () {
  //       var elID = $(this).attr("data-instr");
  //       var instructions = $(this).val();
  //       order.changeInstructions(elID, instructions);
  //     });
  //     $(".remove-item").off().click(function() {
  //       var elID = $(this).attr("data-rem");
  //       $("div#" + elID).remove();
  //       $('#' + elID).prop('checked', false);
  //       order.removeItem(elID);
  //       updateCosts(order);
  //     });
  //   });
  //   $("#submit-order").click(function() {
  //     var name = order.getName();
  //     var roomRef = ref.child("rooms/" + room);
  //     var ordersRef = roomRef.child("orders");
  //     ordersRef.once("value").then(function(snapshot) {
  //       var status = snapshot.val();
  //       var prevNames = [];
  //       if (status) {
  //         Object.keys(status).forEach(function(key) {
  //           prevNames.push(key);
  //         });
  //       }
  //       roomRef.once("value").then(function(snapshot) {
  //         var stat = snapshot.val();
  //         var ordersLeft = stat.numLeft;
  //         if (name == "") {
  //           alert("Enter a name please");
  //         } else if (prevNames.includes(name)){
  //           alert("This name is already taken");
  //         } else if (ordersLeft <= 0) {
  //           alert("No orders left");
  //         } else {
  //           var nameRef = ordersRef.child(name);
  //           nameRef.set(order);
  //           roomRef.update({numLeft: ordersLeft - 1});
  //           $(location).attr('href', 'confirm.html');
  //         }
  //       });
  //     });
  //   });
  // }
  //
  // function updateCosts(order) {
  //   var costs = order.getCosts();
  //   $("#o-subtotal").text(costs.subTotal);
  //   $("#o-taxtip").text(costs.taxTip);
  //   $("#o-total").text(costs.total);
  // }

  // function createRoom() {
  //   $("#create").click(function() {
  //     var place = $("#where").val();
  //     var time = $("#when").val();
  //     time = makeTimeString(time);
  //     var num = parseInt($("#maxNum").val());
  //     var rooms = ref.child("rooms");
  //     var newRef = rooms.push({
  //       closeTime: time,
  //       numLeft: num,
  //       place: place
  //     });
  //     var newKey = newRef.key;
  //     $(location).attr('href', 'host.html?room=' + newKey);
  //   })
  // }
  // createRoom();

  // function round(value) {
  //   return parseFloat(value.toFixed(2));
  // }

  // function setTime() {
  //   var d = new Date();
  //   var m = d.getMinutes();
  //   var h = d.getHours();
  //   if(h<10){h='0'+h}
  //   if(m<10){m='0'+m}
  //
  //   var currentTime = h+":"+m;
  //   $("#when").val(currentTime);
  // }
  // setTime();
  //
  // function makeTimeString(time) {
  //   var h = parseInt(time.substring(0,2));
  //   var m = parseInt(time.substring(3));
  //   var s = 0
  //   var d = new Date();
  //   d.setHours(h, m, s);
  //   return d.toString();
  // }

  // function getParameterByName(name, url) {
  //     if (!url) url = window.location.href;
  //     name = name.replace(/[\[\]]/g, "\\$&");
  //     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  //         results = regex.exec(url);
  //     if (!results) return null;
  //     if (!results[2]) return '';
  //     return decodeURIComponent(results[2].replace(/\+/g, " "));
  // }

// });
