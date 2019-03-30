document.querySelector('#checkbox').addEventListener('change', (event) => {
  const element = document.querySelector('.rect');
  if (element.classList.contains('state-show') === true) {
    element.classList.remove('state-show');
  } else {
    element.classList.add('state-show');
  }
});

const targetEl = document.querySelector('.rect');
targetEl.addEventListener('animationstart', (event) => {
  // アニメーションが開始したときのイベント
  document.querySelector('.log').innerHTML = 'animationstart 発生 : ' + new Date().toLocaleTimeString();
});

targetEl.addEventListener('animationiteration', (event) => {
  // アニメーションで繰り返しが発生した時のイベント
  // （繰り返しが未指定の場合は発生しない）
  document.querySelector('.log').innerHTML = 'animationiteration 発生 : ' + new Date().toLocaleTimeString();
});

targetEl.addEventListener('animationend', (event) => {
  // アニメーションが完了したときのイベント
  // （繰り返しを指定した場合は発生しない）
  document.querySelector('.log').innerHTML = 'animationend 発生 : ' + new Date().toLocaleTimeString();
});