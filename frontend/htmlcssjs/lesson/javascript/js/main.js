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

// 処理負荷軽減のためタイマーで処理を行う。
let resizeTimer;
function resizeHandler(event) { 
  // resizeTimerがあればタイマーを解除
  if (resizeTimer != null) {
    clearTimeout(resizeTimer);
  }
  // 1秒後にonResize()を実行する
  resizeTimer = setTimeout(() => {
    const dpr = window.devicePixelRatio
    document.querySelector('.value-dpr').innerHTML = `デバイスピクセル比は ${dpr} です。`;
  
    const w = innerWidth;
    const h = innerHeight;
    document.querySelector('.value-width').innerHTML = `横幅 ${w}px です。`;
    document.querySelector('.value-height').innerHTML = `高さ ${h}px です。`; 
  }, 1000)
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

  // Windowの位置によってマウスの座標も変わるため、エリアの位置の差+調整値との差分を移動距離とする。
  const moveX = event.clientX - areaRect.left - 40;
  const moveY = event.clientY - areaRect.top - 40;
  if (moveX > maxLeft && moveY > maxTop && moveX <= maxRight && moveY <= maxBottom) {
    areaLesson10.style.left = `${moveX}px`;
    areaLesson10.style.top = `${moveY}px`;
  }

  // console.log(areaRect);
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

/**
 *  Lesson 12 テキスト選択時に処理
 **/
const balloon = document.querySelector('.lesson12 .balloon');
const paragraph = document.querySelector('.lesson12 .paragraph');

// 選択開始したときの処理
paragraph.addEventListener('selectstart', () => {
  // マウスを離したときの処理
  paragraph.addEventListener('mouseup', (event) => {
    // 選択されている文字列を取得する
    const selectionCharacters = window.getSelection().toString();
    if (selectionCharacters.length > 0) {
      balloon.innerHTML = selectionCharacters;
      balloon.classList.add('on');
      balloon.style.left = `${event.clientX - balloon.clientWidth / 2}px`;
      balloon.style.top = `${event.clientY - balloon.clientHeight * 2}px`;
    } else {
      // 選択文字列がなければ吹き出しを閉じる
      removePopup();
    }
  }, { once: true });
});
// 吹き出しをクリックしたら閉じる
balloon.addEventListener('click', removePopup);

function removePopup() {
  balloon.classList.remove('on');
}

/**
 *  Lesson 13 タッチ操作時のイベント発生情報を取得（スマフォのみ）
 **/
document.querySelector('.lesson13 .area').addEventListener('touchmove', (event) => {
  const touch = event.changedTouches;
  const log = document.querySelector('.lesson13 .log');
  log.innerHTML = `${touch[0].pageX.toFixed(2)}<br>${touch[0].pageY.toFixed(2)}`;
})

/**
 *  Lesson 14 画面サイズのブレークポイントを超えた時の処理
 **/
const rectAngle = document.querySelector('.lesson14 .rectangle');

// メディアクエリ情報
const mediaQueryList = matchMedia('(min-width: 600px)');

// メディアクエリ変更されたタイミングで処理
mediaQueryList.addListener(onMediaQueryChange);

// ブレークポイントを超えると big-size classに付与してデザインを変えている。
function onMediaQueryChange(mediaQueryList) {
  if (mediaQueryList.matches === true) {
    rectAngle.classList.add('big-size');
    rectAngle.innerHTML = 'ウインドウサイズが600pxを超えました。';
  } else {
    rectAngle.classList.remove('big-size');
    rectAngle.innerHTML = 'ウインドウサイズが600pxを下回りました。';
  }
}
onMediaQueryChange(mediaQueryList);


/**
 *  Lesson 15 ドロップ&ドラッグ
 **/
const fileZone = document.querySelector('.file-zone');  // ファイルアップロードゾーン
const lesson15ClassName = 'on'; // ファイルアップロードゾーンに着脱するクラス

// ドラッグした要素が重なったときの処理
fileZone.addEventListener('dragover', (event) => {
  event.preventDefault();             // デフォルトの挙動を停止
  fileZone.classList.add(lesson15ClassName);  // 'on'を付与して .file-zone.on にする
});

// ドラッグした要素が離れたときの処理
fileZone.addEventListener('dragleave', () => {
  event.preventDefault();               // デフォルトの挙動を停止
  fileZone.classList.remove(lesson15ClassName); // 'on'を削除する
});

// ドロップした時の処理
fileZone.addEventListener('drop', (event) => {
  event.preventDefault();                         // デフォルトの挙動を停止
  fileZone.classList.remove(lesson15ClassName);             // 'on'を削除する
  const transferdFiles = event.dataTransfer.files;  // Fileオブジェクトを参照
  displayImages(transferdFiles);                    // 画像を表示する
});

// 画像の表示処理 
function displayImages(transferdFiles) {
  const imageFileList = [];               // 画像ファイルの格納配列
  const fileNum = transferdFiles.length;  // ファイル数
  for (let i = 0; i < fileNum; i++) {
    // ファイルが画像のもののみを配列に格納する
    if (transferdFiles[i].type.match('image.*') === false) { return; }
    imageFileList.push(transferdFiles[i]);
  }

  const imagePreviewArea = document.querySelector('.image-list'); // 画像表示エリアの参照

  // 各画像ファイルについて処理
  for (const imageFile of imageFileList) {
    // 画像ファイルの読み込み処理
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.addEventListener('load', (event) => {
      const image = new Image();
      image.src = event.target.result;
      imagePreviewArea.insertBefore(image, imagePreviewArea.firstChild);  // 表示エリアの先頭に画像ファイルを表示
    });
  }
}

/**
 *  Lesson 16 HTMLコードを要素として挿入
 **/
function lesson16() {
  const area = document.querySelector('.lesson16 .area');
  const newBox = `<div class="new-box box">.new-box要素</div>`;
  setTimeout(() => {
    area.insertAdjacentHTML('afterbegin', newBox);  // .area要素内先頭に.new-box要素を追加する
    area.insertAdjacentHTML('afterend', newBox);    // .area要素の直後に.new-box要素を追加する
  }, 2000)
}
lesson16()

/**
 *  Lesson 17 要素を動的に削除する
 **/
function lesson17() {

  // 親エレメントを使って削除
  setTimeout(() => {
    const parentElement = document.querySelector('.lesson17 .area');
    const childElement = document.querySelector('.lesson17 .child.one');
    parentElement.removeChild(childElement);
  }, 3000)

  // 自分自身を削除
  setTimeout(() => {
    const childElement = document.querySelector('.lesson17 .child.two');
    childElement.remove();
  }, 4000)
}
lesson17()

/**
 *  Lesson 18 要素を生成する
 **/
document.querySelector('.lesson18 .create-modal').addEventListener('click', displayModalWindow);

// モーダルウインドウを開く
function displayModalWindow() {
  const modalElement = document.createElement('div');
  modalElement.classList.add('modal');

  const innerElement = document.createElement('div');
  innerElement.classList.add('inner');
  innerElement.innerHTML = `<p>モーダルウインドウの中身です</p>`;
  modalElement.appendChild(innerElement);
  
  // body要素にモーダルウインドウを配置する
  document.body.appendChild(modalElement);

  innerElement.addEventListener('click', () => {
    closeModalWindow(modalElement);
  });
}

// モーダルウインドウを閉じる
function closeModalWindow(modalElement) {
  document.body.removeChild(modalElement)
}