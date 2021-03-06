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

  // Used to round values
  function round(value) {
    return parseFloat(value.toFixed(2));
  }

  // Used to round values, returns a string
  function showTwo(value) {
    return value.toFixed(2);
  }

  // Used to get the room ID from the url
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // A class to keep track of a user's order
  class Order {
    constructor() {
      this.name = '';
      this.time = '';
      this.items = [];
      this.subTotal = 0;
      this.taxTip = 0;
      this.total = 0;
    }

    setName(val) {
      this.name = val;
    }

    setTime(val) {
      this.time = val;
    }

    getName() {
      return this.name;
    }

    getItems() {
      return this.items;
    }

    getCosts() {
      return {
        subTotal: this.subTotal,
        taxTip: this.taxTip,
        total: this.total
      };
    }

    addItem(id, name, price, quantity, instructions) {
      let newItem = {};
      newItem.id = id;
      newItem.name = name;
      newItem.price = price;
      newItem.quantity = quantity;
      newItem.itemCost = price * quantity;
      newItem.instructions = instructions;
      this.items.push(newItem);
      this.calculateCosts();
    }

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.calculateCosts();
    }

    changeQuantity(id, quantity) {
      let index = 0;
      for (let i = 0; i < this.items.length; i += 1) {
        if (this.items[i].id === id) {
          index = i;
          break;
        }
      }
      if (quantity > 0 && quantity !== this.items[index].quantity) {
        this.items[index].quantity = quantity;
        this.items[index].itemCost = this.items[index].price * this.items[index].quantity;
        this.calculateCosts();
      }
    }

    changeInstructions(id, instructions) {
      let index = 0;
      for (let i = 0; i < this.items.length; i += 1) {
        if (this.items[i].id === id) {
          index = i;
          break;
        }
      }
      this.items[index].instructions = instructions;
    }

    calculateCosts() {
      let subTotal = 0;
      for (let item of this.items) {
        subTotal += item.price * item.quantity;
      }
      this.subTotal = round(subTotal);
      this.taxTip = round(0.11 * this.subTotal);
      this.total = round(this.subTotal + this.taxTip);
    }
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
  function makeMenuItem(id, name, price) {
    return (
      `<div class="menu-item">
        <input id="${id}" type="checkbox"></input>
        <label for="${id}">$${price} - ${name}</label>
      </div>`
    );
  }

  // Takes the json menu and makes it into text and buttons on the order page
  function makeMenu(data) {
    let menuItems = data;
    let groups = [];

    for (let item of menuItems) {
      if (!(groups.includes(item.group))) {
        groups.push(item.group);
        $('#menu').append(makeMenuGroup(item.group));
      }
      $(`div[data-group="${item.group}"]`).append(makeMenuItem(item.id, item.name, showTwo(item.price)));
      $(`#${item.id}`).data(item);
    }
  }

  // Handles toggle for any menu headers
  function handleToggle() {
    $('p[data-group]').click(function () {
      let group = $(this).attr('data-group');
      $(`div[data-group="${group}"]`).toggle(500);
    });
  }

  function makeOrderItem(id, name, price, suggested) {
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
          <div class="instr">
            <textarea data-instr="${id}" class="instr-text" placeholder="For item additions, deletions, and/or additional info."></textarea>
            ${suggested ? `<div class="suggested">Suggested things to include: ${suggested.split(';').map(el => `<div>${el}</div>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>`
    );
  }

  // Handles everything related to taking the order once the menu has been loaded,
  // including getting a user's name, the items they choose, those item quantities
  // and descriptions, and calculates costs
  function takeOrder() {
    const order = new Order();

    $('#name').off().bind('keyup mouseup', function () {
      let val = $(this).val();
      order.setName(val);
    });

    $('input[type="checkbox"]').click(function () {
      let el = this;
      let selector = $(`#${el.id}`);
      let itemData = selector.data();

      if (selector.is(':checked')) {
        $('#order').append(makeOrderItem(itemData.id, itemData.name, showTwo(itemData.price), itemData.suggested));
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

      $('.remove-item').off().click(function () {
        let elID = $(this).attr('data-rem');
        $(`div#${elID}`).remove();
        $(`#${elID}`).prop('checked', false);
        order.removeItem(elID);
        updateCosts(order);
      });
    });

    $('#submit-order').click(function () {
      let name = order.getName();
      let roomRef = ref.child(`rooms/${room}`);
      let ordersRef = roomRef.child('orders');
      let orderTime = new Date().toString();
      order.setTime(orderTime);

      ordersRef.once('value').then((snapshot) => {
        let status = snapshot.val();
        let prevNames = [];
        if (status) {
          prevNames = Object.keys(status);
        }
        roomRef.once('value').then((snap) => {
          let stat = snap.val();
          let ordersLeft = stat.numLeft;
          if (order.items.length == 0) {
            $('#o-modal-text').text('This order has no items!');
            $('#modal').css('display', 'block');
          } else {
            if (!name) {
              $('#o-modal-text').text('Enter a name please!');
              $('#modal').css('display', 'block');
            } else if (prevNames.includes(name)) {
              $('#o-modal-text').text('This name is already taken!');
              $('#modal').css('display', 'block');
            } else if (ordersLeft <= 0) {
              $('#o-modal-text').text('No orders left!');
              $('#modal').css('display', 'block');
            } else {
              let nameRef = ordersRef.child(name);
              nameRef.set(order);
              roomRef.update({
                numLeft: ordersLeft - 1
              });
              $(location).attr('href', 'confirm.html');
            }
          }
        });
      });
    });
  }

  // Given costs, just updates the elements at the bottom of the order page
  function updateCosts(order) {
    const costs = order.getCosts();
    $('#o-subtotal').text(showTwo(costs.subTotal));
    $('#o-taxtip').text(showTwo(costs.taxTip));
    $('#o-total').text(showTwo(costs.total));
  }

  // For readability
  function doActions(data) {
    makeMenu(data);
    handleToggle();
    takeOrder();
  }

  // The below happens on page load to fill out fields near the top, and then
  // also loads the menu and makes it interactive
  const room = getParameterByName('room');
  if (room) {
    const roomRef = ref.child('rooms').child(room);
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

    roomRef.on('value', (snapshot) => {
      const status = snapshot.val();
      const resName = placeMap[status.place];
      $('#o-resName').text(resName);
      let numLeft = status.numLeft;
      $('#o-numLeft').text(numLeft > 0 ? numLeft : 'no');
      let closeTime = new Date(status.closeTime);
      let now = new Date();
      let diff = round((closeTime - now) / 1000 / 60);
      $('#o-closeTime').text(diff >= 0 ? `${diff} minutes.` : 'Order closed!');
      document.title = `${resName} - ${diff} minutes remaining - Order`;
    });

    roomRef.once('value')
      .then((snapshot) => {
        $('#loading').css('display', 'none');
        $('#loaded').css('display', 'block');
        const status = snapshot.val();
        let numLeft = status.numLeft;
        let closeTime = new Date(status.closeTime);
        let now = new Date();
        let diff = round((closeTime - now) / 1000 / 60);

        if (numLeft > 0 && diff > 0) { // Only show menu if orders and time left
          $('#o-interior').css('display', 'block');
          $('#o-nameField').css('display', 'block');
          $('#submit-order').css('display', 'block');
          $('.note').css('display', 'inline');
          $('.sorry').css('display', 'none');
          const menuUrl = `./static/menus/${status.place}.json`;
          $.getJSON(menuUrl, doActions);
        }
      });
  }

  // Bind closing the modal to clicking the 'X' in the modal
  $('.close-modal').click(() => {
    $('#modal').css('display', 'none');
  });

  // Bind closing the modal to clicking outside the modal
  $(window).click((evt) => {
    if (evt.target === $('#modal')[0]) {
      $('#modal').css('display', 'none');
    }
  });

  $(document).keypress((key) => {
    if (key.keyCode === 13) {
      key.preventDefault();
      if ($('#modal').css('display') === 'block') {
        $('#modal').css('display', 'none');
      }
    }
  });
});