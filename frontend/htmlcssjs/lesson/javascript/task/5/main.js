function func1() {
  const text1 = document.getElementById('text1');
  const text2 = document.getElementById('text2');
  const text3 = document.getElementById('text3');
  document.querySelector('#result').innerHTML = text1.value + text2.value + text3.value;
}

const btn1 = document.querySelector('#btn1');
btn1.addEventListener('click', func1)
