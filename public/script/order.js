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

  // A class to keep track of a user's order
  class Order {
    constructor() {
      this.name = '';
      this.items = [];
      this.subTotal = 0;
      this.taxTip = 0;
      this.total = 0;
    }
    setName(val) {
      this.name = val;
    }
    getName() {
      return this.name;
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

  // Used to round values
  function round(value) {
    return parseFloat(value.toFixed(2));
  }

  // Used to get the room ID from the url
  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // For readability
  function doActions(data) {
    makeMenu(data);
    handleToggle();
    takeOrder();
  }

  // Make the html for groups and titles for menu items
  function makeMenuGroup(group) {
    return (
      `<div>
        <p data-group="${group}" class="menu-group-title">${group} +</p>
        <div data-group="${group}" style="display: none">
        </div>
      </div>`
    );
  }

  // Make the html for a single menu item
  function makeMenuItem(id, price, name) {
    return (
      `<div class="menu-item">
        <input id="${id}" type="checkbox"></input>
        <label for="${id}">$${price} - ${name}</label>
      </div>`
    );
  }

  // Takes the json menu and makes it into text and buttons on the order page
  function makeMenu(data){
    let menuItems = data;
    let groups = [];

    for (let item of menuItems) {
      if (!(groups.includes(item.group))) {
        groups.push(item.group);
        $('#menu').append(makeMenuGroup(item.group));
      }
      $(`div[data-group="${item.group}"]`).append(makeMenuItem(item.id, item.price, item.name));
      $(`#${item.id}`).data(item);
    }
  }

  // Handles toggle for any menu headers
  function handleToggle() {
    $('p[data-group]').click(function() {
      let group = $(this).attr('data-group');
      $(`div[data-group="${group}"]`).toggle(500);
    });
  }

  function makeOrderItem(id, name, price) {
    return (
      `<div class="order-item" id="${id}">
        <div class="order-item-top">
          <span>$${price} - ${name}</span>
          <div class="remove-item" data-rem="${id}">
            <span>X</span>
          </div>
        </div>
        <div class="quantity-div">
          <label for="${id}-amt">Quantity: </label>
          <input type="number" id="${id}-amt" data-amt="${id}" class="quantity-input" value="1" min="1"></input>
        </div>
        <div>
          <span>Special Instructions:</span>
          <textarea data-instr="${id}" class="instr-text"></textarea>
        </div>
      </div>`
    );
  }

  // Handles everything related to taking the order once the menu has been loaded,
  // including getting a user's name, the items they choose, those item quantities
  // and descriptions, and calculates costs
  function takeOrder() {
    var order = new Order();

    $('#name').off().bind('keyup mouseup', function () {
      let val = $(this).val();
      order.setName(val);
    });

    $('input[type="checkbox"]').click(function() {
      let el = this;
      let selector = $(`#${el.id}`);
      let itemData = selector.data();

      if (selector.is(':checked')) {
        $('#order').append(makeOrderItem(itemData.id, itemData.name, itemData.price));
        order.addItem(itemData.id, itemData.name, itemData.price, 1, '');
      } else {
        $(`div#${itemData.id}`).remove();
        order.removeItem(itemData.id);
      }
      updateCosts(order);

      $('.quantity-input').off().bind('keyup mouseup', function () {
        let elID = $(this).attr('data-amt');
        let amt = parseInt($(this).val());
        order.changeQuantity(elID, amt);
        updateCosts(order);
      });

      $('.instr-text').off().bind('keyup mouseup', function () {
        let elID = $(this).attr('data-instr');
        let instructions = $(this).val();
        order.changeInstructions(elID, instructions);
      });

      $('.remove-item').off().click(function() {
        let elID = $(this).attr('data-rem');
        $(`div#${elID}`).remove();
        $(`#${elID}`).prop('checked', false);
        order.removeItem(elID);
        updateCosts(order);
      });
    });

    $('#submit-order').click(function() {
      let name = order.getName();
      let roomRef = ref.child('rooms/' + room);
      let ordersRef = roomRef.child('orders');

      ordersRef.once('value').then((snapshot) => {
        let status = snapshot.val();
        let prevNames = [];
        if (status) {
          prevNames = Object.keys(status);
        }
        roomRef.once('value').then((snapshot) => {
          let stat = snapshot.val();
          let ordersLeft = stat.numLeft;
          if (name == '') {
            alert('Enter a name please');
          } else if (prevNames.includes(name)){
            alert('This name is already taken');
          } else if (ordersLeft <= 0) {
            alert('No orders left');
          } else {
            let nameRef = ordersRef.child(name);
            nameRef.set(order);
            roomRef.update({numLeft: ordersLeft - 1});
            $(location).attr('href', 'confirm.html');
          }
        });
      });
    });
  }

  // Given costs, just updates the elements at the bottom of the order page
  function updateCosts(order) {
    let costs = order.getCosts();
    $('#o-subtotal').text(costs.subTotal);
    $('#o-taxtip').text(costs.taxTip);
    $('#o-total').text(costs.total);
  }

  // The below happens on page load to fill out fields near the top, and then
  // also loads the menu and makes it interactive
  const room = getParameterByName('room');
  if (room){
    let roomRef = ref.child('rooms').child(room);

    roomRef.on('value', (snapshot) => {
      let status = snapshot.val();
      $('#o-resName').text(status.place);
      $('#o-numLeft').text(status.numLeft);
      let closeTime = new Date(status.closeTime);
      let now = new Date();
      let diff = round((closeTime - now)/1000/60);
      $('#o-closeTime').text(diff >= 0 ? `${diff} minutes.` : 'Order closed!');

      if (diff > 0) { // Only show menu if time left
        $('#o-interior').css('display', 'block');
        $('#o-nameField').css('display', 'block');
        $('#submit-order').css('display', 'block');
        roomRef.once('value').then((snapshot) => {
          let status = snapshot.val();
          if (status.place === 'McDonald\'s'){
            let url = './static/menus/mcd.json';
            $.getJSON(url, doActions);
          }
        });
      }
    });
  }

  $(document).keypress((key) => {
    if (key.keyCode === 13) {
      key.preventDefault();
    }
  });
});
