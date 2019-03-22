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
 *  Lesson 3 Window画面サイズの表示
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
 *  Lesson 6 Windowのスクロール
 **/
document.querySelector('.lesson6 .action__scroll').addEventListener('click', (event) => {
  window.scrollTo(0, 1000);
})
window.onscroll = () => {
  const x = window.scrollX;
  const y = window.scrollY;
  console.log('scroll', x, y);
  document.querySelector('.value-scrollX').innerHTML = `X ${x}`;
  document.querySelector('.value-scrollY').innerHTML = `Y ${y}`;
}
