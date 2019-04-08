
var time = 0
const element = document.querySelector('#countDown');
setInterval(() => {
  time += 1
  element.innerHTML = time
}, 1000);