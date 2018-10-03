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

  // Used to round values, returns a string
  function showTwo(value) {
    return value.toFixed(2);
  }

  // This makes a div that will eventually hold all of the items in a
  // single person's order
  function makeOrderGroup(name, time, index) {
    return (
      `<div class="list-item">
        <div class="list-item-top">
          <p class="person">${name}</p>
          <span>${time}</span>
        </div>
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
        <div class="food-item-cost">Price: $${showTwo(cost)}</div>
        <div class="food-item-amt">Quantity: ${quantity}</div>
        <div class="food-item-instr"> Special Instructions: ${instructions === "" ? "None" : instructions}</div>
      </div>`
    );
  }

  // This makes a div that has the total cost for a person's order
  function makeOrderTotal(total) {
    return (
      `<div>Total after tax and delivery: $${showTwo(total)}</div>`
    );
  }

  // The below takes the snapshot of the database and uses it to fill out
  // content in the page
  function fillHostPage(status) {
    $('#orderList').children().remove();

    let orders = status.orders;
    if (orders) {
      let ordersArray = Object.values(orders);
      let index = 0, subTotal = 0, taxTip = 0, total = 0;
      ordersArray.sort((a, b) => {
        const aTime = new Date(a.time);
        const bTime = new Date(b.time);
        return bTime - aTime;
      });
      for (let order of ordersArray) {
        const orderTime = new Date(order.time).toLocaleTimeString();

        $('#orderList').append(makeOrderGroup(order.name, orderTime, index));
        for (let item of order.items) {
          $(`#order${index}`).append(makeOrderItem(item.name, item.itemCost, item.quantity, item.instructions));
        }
        $(`#order${index}`).append(makeOrderTotal(order.total));

        subTotal += order.subTotal;
        taxTip += order.taxTip;
        total += order.total;
        index += 1;
      }
      $('#h-subtotal').text(showTwo(subTotal));
      $('#h-taxtip').text(showTwo(taxTip));
      $('#h-total').text(showTwo(total));
    }
  }

  // This function starts the listener on order changes to know when to
  // refill the host's page with orders
  function activateFill() {
    const roomRef = ref.child('rooms').child(room);

    roomRef.on('value', (snapshot) => {
      const status = snapshot.val();
      let numLeft = status.numLeft;
      let closeTime = new Date(status.closeTime);
      let now = Date.now();
      let diff = showTwo((closeTime - now) / 1000 / 60);

      $('#h-numLeft').text(numLeft > 0 ? numLeft : 'no');
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
    const roomLink = `https://mcd4-me.firebaseapp.com/order.html?room=${room}`;
    $('#h-roomLink').html(`<a href="${roomLink}">${roomLink}</a>`);
    const roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      const status = snapshot.val();
      const password = status.password;

      if (!password) {
        $('#pass-container').toggle();
        $('#interior').toggle();
        activateFill();
      } else {
        const localStoragePass = localStorage.getItem(`pass${room}`);
        if (localStoragePass) {
          if (localStoragePass === password) {
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
    const roomRef = ref.child('rooms').child(room);
    let pass = $('#pass-text').val();
    if (pass) {
      roomRef.once('value').then((snapshot) => {
        const status = snapshot.val();
        const expected = status.password;
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

  // Bind entering password or removing modal to pressing enter
  $(document).keypress((key) => {
    if ($('#pass-container').css('display') === 'block' && key.keyCode === 13) {
      key.preventDefault();
      if ($('#modal').css('display') === 'block') {
        $('#modal').css('display', 'none');
      } else if ($('#modal').css('display') === 'none') {
        handlePass();
      }
    }
  });

  // The below increases the max amount orders
  $('#h-increaseNum').click(() => {
    const roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      const status = snapshot.val();
      let numLeft = status.numLeft;
      roomRef.update({ numLeft: numLeft + 1 });
    });
  });

  // The below increases the time limit for orders
  $('#h-increaseTime').click(() => {
    const roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      const status = snapshot.val();
      let closeTime = new Date(status.closeTime);
      let now = new Date();
      let diff = closeTime - now;

      let newCloseTime = (diff > 0
        ? new Date(closeTime.getTime() + 1 * 60000)
        : new Date(now.getTime() + 1 * 60000)
      );
      roomRef.update({ closeTime: newCloseTime.toString() });
    });
  });

  // The below increases the time limit for orders by ten
  $('#h-increaseTimeByTen').click(() => {
    const roomRef = ref.child('rooms').child(room);

    roomRef.once('value').then((snapshot) => {
      const status = snapshot.val();
      let closeTime = new Date(status.closeTime);
      let now = new Date();
      let diff = closeTime - now;

      let newCloseTime = (diff > 0
        ? new Date(closeTime.getTime() + 10 * 60000)
        : new Date(now.getTime() + 10 * 60000)
      );
      roomRef.update({ closeTime: newCloseTime.toString() });
    });
  });
});
