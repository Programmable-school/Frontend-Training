function func1(type) {
  const text1 = document.getElementById('text1');
  const text2 = document.getElementById('text2');
  const value1 = Number(text1.value);
  const value2 = Number(text2.value);
  let result = 0
  switch (type) {
    case 0:
      result = value1 + value2;
      break;
    case 1:
      result = value1 - value2;
      break;
    case 2:
      result = value1 * value2;
      break;
    case 3:
      result = value1 / value2;
      break;
  }
  document.querySelector('#result').innerHTML = result;
}

document.querySelector('#btn1').addEventListener('click', () => {
  func1(0);
});
document.querySelector('#btn2').addEventListener('click', () => {
  func1(1);
});
document.querySelector('#btn3').addEventListener('click', () => {
  func1(2);
});
document.querySelector('#btn4').addEventListener('click', () => {
  func1(3);
});
