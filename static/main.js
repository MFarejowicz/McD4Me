var d = new Date();
var m = d.getMinutes();
var h = d.getHours();

var currentTime = h+":"+m;
var timeControl = document.querySelector('input[type="time"]');
timeControl.value = currentTime;
