/* JavaScript */

/**
 *  Lesson 1 時間の経過
 **/
const oldTime = Date.now();
setInterval(() => {
  const currentTime = Date.now()
  
  // 経過時間（ミリ秒）
  const diff = currentTime - oldTime;

  // 秒数を得る
  const sec = Math.floor(diff / 1000);

  /**
   * HTMLに文字列を挿入
   * 
   * document.querySelector
   * querySelector内に記述したタグのElementを取得する
   * https://developer.mozilla.org/ja/docs/Web/API/Document/querySelector
   */
  document.querySelector('#log').innerHTML = `${sec}秒が経過`
}, 100)


/**
 *  Lesson 2 Alert確認
 **/
const btnLesson2 = document.querySelector('.lesson2 .action');
btnLesson2.addEventListener('click', (event) => {
  const isYes = confirm('こんにちは！僕の質問を聞きたい？');
  if (isYes) {
    const text = prompt('天気は晴れていますか？', '');
    document.querySelector('.lesson2 .log').innerHTML = text;
  }
})

/**
 *  Lesson 3 タイトル変更
 **/
document.querySelector('.lesson3 .action__training').addEventListener('click', (event) => {
  document.title = 'トレーニング';
})

document.querySelector('.lesson3 .action__lesson').addEventListener('click', (event) => {
  document.title = 'レッスン';
})

/**
 *  Lesson 4 パネルタッチ可能なデバイスかどうか判定する
 **/
function lesson4() {
  const isSuported = !!('ontouchstart' in window || (navigator.pointerEnabled && navigator.maxTouchPoints > 0));
  console.log("touch support status", isSuported)
  if (isSuported) {
    document.querySelector('.lesson4 .log').innerHTML = 'パネルタッチできるデバイスです。';
  } else {
    document.querySelector('.lesson4 .log').innerHTML = 'パネルタッチできないデバイスです。';
  }
}
lesson4();

/**
 *  Lesson 5 ページ遷移 画面更新 別タブで表示
 **/
document.querySelector('.lesson5 .action__next').addEventListener('click', (event) => {
  location.href = 'next_page.html';
})
document.querySelector('.lesson5 .action__reload').addEventListener('click', (event) => {
  location.reload(true);
})
document.querySelector('.lesson5 .action__show').addEventListener('click', (event) => {
  window.open('next_page.html').focus();
})

/**
 *  Lesson 6 Window画面サイズの表示
 **/
window.addEventListener('resize', resizeHandler);
function resizeHandler(event) { 
  const dpr = window.devicePixelRatio
  document.querySelector('.value-dpr').innerHTML = `デバイスピクセル比は ${dpr} です。`;

  const w = innerWidth;
  const h = innerHeight;
  document.querySelector('.value-width').innerHTML = `横幅 ${w}px です。`;
  document.querySelector('.value-height').innerHTML = `高さ ${h}px です。`; 
}

/**
 *  Lesson 7 オンラインとオフラインの状態確認
 **/
if (navigator.onLine) {
  document.querySelector('.lesson7 .log').innerHTML = 'オンライン';
} else {
  document.querySelector('.lesson7 .log').innerHTML = 'オフライン';
}

/**
 *  Lesson 8 ページが表示された時に処理を行う
 **/
window.addEventListener('DOMContentLoaded', () => {
  const num = document.querySelectorAll('.lesson8 .value').length;
  document.querySelector('.lesson8 .log').innerHTML = `→ valueの個数は ${num}です。`;
})

/**
 *  Lesson 9 マウス操作 1
 **/
const areaLesson9 = document.querySelector('.lesson9 .area')
const contentLesson9 = document.querySelector('.lesson9 .area .content')
areaLesson9.addEventListener('mousedown', () => {
  contentLesson9.innerHTML = "マウスボタンを押した";
})
areaLesson9.addEventListener('mouseup', () => {
  contentLesson9.innerHTML = "マウスボタンを離した";
})
areaLesson9.addEventListener('mouseenter', () => {
  contentLesson9.innerHTML = "マウスが乗った";
})
areaLesson9.addEventListener('mouseleave', () => {
  contentLesson9.innerHTML = "マウスが離れた";
})
areaLesson9.addEventListener('mousemove', (event) => {
  document.querySelector('.lesson9 .position').innerHTML = `マウスの座標 <br>x: ${event.clientX} y: ${event.clientY}`;
})

/**
 *  Lesson 10 マウス操作 2
 **/
const areaLesson10 = document.querySelector('.lesson10 .area');
areaLesson10.addEventListener('mousedown', () => {
  // マウスの動きに合わせてエリアを動かせる
  document.addEventListener('mousemove', onMouseMove);
  // ページ上でマウスボタンを話したらキャラクターの移動を終了する
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
  });
})
function onMouseMove(event) {
  const maxLeft = 0;
  const maxTop = 0;
  const maxRight = 400;
  const maxBottom = 400;

  // 移動可能なエリア領域を取得
  const area = document.getElementsByClassName('container__content lesson10')
  const areaRect = area[0].getBoundingClientRect();
  // console.log(areaRect);
  
  // Windowの位置によってマウスの座標も変わるため、エリアの位置の差+調整値との差分を移動距離とする。
  const moveX = event.clientX - areaRect.left - 40;
  const moveY = event.clientY - areaRect.top - 40;
  if (moveX > maxLeft && moveY > maxTop && moveX <= maxRight && moveY <= maxBottom) {
    areaLesson10.style.left = `${moveX}px`;
    areaLesson10.style.top = `${moveY}px`;
  }
  // console.log('onMouseMove', areaLesson10.style.left, areaLesson10.style.top);  
}

/**
 *  Lesson 11 Windowのスクロール
 **/
document.querySelector('.lesson11 .action__scroll').addEventListener('click', (event) => {
  window.scrollTo(0, 100);
})
window.onscroll = () => {
  const x = window.scrollX;
  const y = window.scrollY;
  document.querySelector('.value-scrollX').innerHTML = `X ${x}`;
  document.querySelector('.value-scrollY').innerHTML = `Y ${y}`;
}