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

  // Used to get room ID from url
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Used to round values, returns a number
  function round(value) {
    return parseFloat(value.toFixed(2));
  }

  // Used to round values, returns a string
  function showTwo(value) {
    return value.toFixed(2);
  }

  // This makes a div that will eventually hold all of the items in a
  // single person's order
  function makeOrderGroup(name, index) {
    return (
      `<div class="list-item">
        <p class="person">${name}</p>
        <div class="item-cluster" id="order${index}">
        </div>
      </div>`
    );
  }

  // This makes a div that hold all of the information for one item in a
  // person's order
  function makeOrderItem(name, cost, quantity, instructions) {
    return (
      `<div class="food-item">
        <div class="food-item-name">${name}</div>
        <div class="food-item-cost">Price: $${cost}</div>
        <div class="food-item-amt">Quantity: ${quantity}</div>
        <div class="food-item-instr"> Special Instructions: ${instructions === "" ? "None" : instructions}</div>
      </div>`
    );
  }

  // This makes a div that has the total cost for a person's order
  function makeOrderTotal(total) {
    return (
      `<div>Total after tax and delivery: $${total}</div>`
    );
  }

  // The below takes the snapshot of the database and uses it to fill out
  // content in the page
  function fillHostPage(status) {
    $('#orderList').children().remove();

    let orders = status.orders;
    let index = 0, subTotal = 0, taxTip = 0, total = 0;
    for (let person in orders) {
      let order = orders[person];

      $('#orderList').append(makeOrderGroup(order.name, index));
      for (var item of order.items) {
        $(`#order${index}`).append(makeOrderItem(item.name, item.itemCost, item.quantity, item.instructions));
      }
      $(`#order${index}`).append(makeOrderTotal(order.total));

      subTotal += order.subTotal;
      taxTip += order.taxTip;
      total += order.total;
      index ++;
    }
    $('#h-subtotal').text(round(subTotal));
    $('#h-taxtip').text(round(taxTip));
    $('#h-total').text(round(total));
  }

  // This function starts the listener on order changes to know when to
  // refill the host's page with orders
  function activateFill() {
    let roomRef = ref.child('rooms').child(room);

    roomRef.on('value', (snapshot) => {
      let status = snapshot.val();
      let closeTime = new Date(status.closeTime);
      let now = Date.now();
      let diff = showTwo((closeTime - now) / 1000 / 60);

      $('#h-numLeft').text(status.numLeft);
      $('#h-timeLeft').text(diff >= 0 ? `${diff} minutes.` : 'Order closed!');
      fillHostPage(status);
    });
  }

  // The below occurs on load and whenever orders are updated, it gets
  // a snapshot of the database, updates fields at the top, and triggers
  // the function that fills content
  const room = getParameterByName('room');
  if (room) {
    $('#h-roomNum').text(room);
    let roomLink = `https://mcd4-me.firebaseapp.com/order.html?room=${room}`;
    $('#h-roomLink').html(`<a href="${roomLink}">${roomLink}</a>`);
    let roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      let status = snapshot.val();
      let password = status.password;

      if (password === '') {
        $('#pass-container').toggle();
        $('#interior').toggle();
        activateFill();
      } else {
        const urlPass = getParameterByName('pass');
        if (urlPass) {
          if (urlPass === password) {
            $('#pass-container').toggle();
            $('#interior').toggle();
            activateFill();
          }
        }
      }
    });
  }

  // Handle displaying the content after entering the password and
  // either hitting the join button or pressing enter
  function handlePass() {
    let roomRef = ref.child('rooms').child(room);
    let pass = $('#pass-text').val();
    if (pass !== '') {
      roomRef.once('value').then((snapshot) => {
        let status = snapshot.val();
        let expected = status.password;
        if (pass === expected) {
          $('#pass-container').toggle(500);
          $('#interior').toggle(500);
          activateFill();
        } else {
          $('#modal').css('display', 'block');
        }
      });
    }
  }

  // Bind entering password to button click
  $('#pass-butt').click(() => {
    handlePass();
  });

  $('.close-modal').click(() => {
    $('#modal').css('display', 'none');
  });

  $(window).click((evt) => {
    if (evt.target === $('#modal')[0]) {
      $('#modal').css('display', 'none');
    }
  });

  // Bind entering password or removing modal to pressing enter
  $(document).keypress((key) => {
    if (
      $('#pass-container').css('display') === 'block' &&
      $('#modal').css('display') === 'block' &&
      key.keyCode === 13
    ) {
      key.preventDefault();
      $('#modal').css('display', 'none');
    } else if (
      $('#pass-container').css('display') === 'block' &&
      $('#modal').css('display') === 'none' &&
      key.keyCode === 13
    ) {
      key.preventDefault();
      handlePass();
    }
  });

  // The below increases the max amount orders
  $('#h-increaseNum').click(() => {
    let roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      let status = snapshot.val();
      let numLeft = status.numLeft;
      roomRef.update({ numLeft: numLeft + 1 });
    });
  });

  // The below increases the time limit for orders
  $('#h-increaseTime').click(() => {
    let roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      let status = snapshot.val();
      let closeTime = new Date(status.closeTime);
      let now = new Date(Date.now());
      let diff = closeTime - now;

      let newCloseTime = (diff > 0
        ? new Date(closeTime.getTime() + 1 * 60000)
        : new Date(now.getTime() + 1 * 60000)
      );
      roomRef.update({ closeTime: newCloseTime.toString() });
    });
  });
});
