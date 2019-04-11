
function func1() {
  const date = new Date();
  const hours = date.getHours();
  let msg = '';
  if (5 <= hours && hours < 12) {
    msg = 'おはようございます';
  } else if (12 <= hours && hours < 19) {
    msg = 'こんにちは';
  } else if (19 <= hours && hours < 24) {
    msg = 'こんばんは';
  } else {
    msg = '夜更かしさん';
  }
  const result = document.querySelector('#result');
  result.innerHTML = msg;
}

const btn1 = document.querySelector('#btn1');
btn1.addEventListener('click', func1)



