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

/**
 *  Lesson 19 要素を置き換える
 **/
function lesson19() {
  setTimeout(() => {
    const area = document.querySelector('.lesson19 .area');
    const oldBox = document.querySelector('.lesson19 .old-box.box');
    const newBox = document.createElement('div');
    newBox.textContent = '新ボックス';
    newBox.classList.add('new-box', 'box');

    // oldBoxをnewBoxのelementに置き換える
    area.replaceChild(newBox, oldBox);
  }, 3000);
}
lesson19();

/**
 *  Lesson 20 要素内のテキストを取得したり書き換えたりする
 **/
function lesson20() {
  const weatherInfomation = document.querySelector('#weather-infomation');
  console.log(weatherInfomation.textContent);

  const weatherElement = document.querySelector('#weather');
  setTimeout(() => {
    weatherElement.innerHTML = '気温は<strong>24度</strong>の予想です。'
  }, 3000);
}
lesson20();

/**
 *  Lesson 21 要素のクラス属性の追加や削除
 **/
function lesson21() {
  // 要素の追加と削除
  const box = document.querySelector('.lesson21 .area');
  box.classList.add('blue');
  box.classList.remove('red');
  box.classList.add('blue', 'yellow', 'pink');
  box.classList.remove('blue', 'yellow');
  console.log(box.classList.contains('blue'), box.classList.contains('red'), box.classList.contains('yellow'), box.classList.contains('pink')); // false false false true

  // 要素の確認
  const box1 = document.querySelector('#box1');
  const box2 = document.querySelector('#box2');
  console.log('#box1', box1.classList.contains('red'), box2.classList.contains('red'));  // #box1 true false
}
lesson21();

/**
 *  Lesson 22 要素のクラス属性の追加や削除
 **/
function lesson22() {
  // .button要素すべてについて処理をする
  document.querySelectorAll('.button').forEach((button) => {
    // .button要素をクリックしたときの処理を設定する
    button.addEventListener('click', () => {
      // .button要素の次の要素のクラスを切り替える
      button.nextElementSibling.classList.toggle('show');
    });
  });
}
lesson22();

/**
 *  Lesson 23 テキストボックスの情報を取得する
 **/
function lesson23() {
  const element = document.querySelector('#myText');
  document.querySelector('.lesson23 .log').innerHTML = element.value;

  // イベントを登録
  element.addEventListener('input', handleChange)
  function handleChange(event) {
    document.querySelector('.lesson23 .log').innerHTML = event.target.value;
  }
}
lesson23();


/**
 *  Lesson 24 テキストエリアの情報を取得する
 **/
function lesson24() {
  const element = document.querySelector('#myTextArea');
  const value = element.value.split('\n').join('<br />'); // \n に <br/>を連結させる
  console.log('lesson24', value);
  document.querySelector('.lesson24 .log').innerHTML = value;
  
  // イベントを登録
  element.addEventListener('input', handleChange);
  function handleChange(event) {
    const httmlStr = event.target.value.split('\n').join('<br />');
    document.querySelector('.lesson24 .log').innerHTML = httmlStr;
  }
}
lesson24();


/**
 *  Lesson 25 チェックボックスの情報を取得したい
 **/
function lesson25() {
  const checkedA = document.querySelector('#cbA').checked;
  const checkedB = document.querySelector('#cbB').checked;
  const checkedC = document.querySelector('#cbC').checked;
  console.log('lesson25', "checkedA", checkedA);
  console.log('lesson25', "checkedB", checkedB);
  console.log('lesson25', "checkedC", checkedC);

  document.querySelector('#cbA').addEventListener('change', handleChange)
  document.querySelector('#cbB').addEventListener('change', handleChange)
  document.querySelector('#cbC').addEventListener('change', handleChange)

  function handleChange(event) {
    const value = event.target.checked;
    const log = `Check${event.target.value}は ${value} になりました`;
    document.querySelector('.lesson25 .log').innerHTML = log;
  }
  
}
lesson25();

/**
 *  Lesson 26 ローカルファイルの情報を取得する
 **/
function lesson26() {
  const element = document.querySelector('#myFile');
  const pEl = document.querySelector('.lesson26 .log');

  element.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log('lesson26', file.name);
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      pEl.textContent = reader.result;  // 結果をp要素に出力する。
    });
    // テキストファイルとして読み込み
    reader.readAsText(file);
  })
}
lesson26();

/**
 *  Lesson 27 DataURLとして読み込む
 **/
function lesson27() {
  const element = document.querySelector('#myFileDataUrl');
  const imgEl = document.querySelector('.lesson27 .log img');

  element.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log('lesson27', file.name);
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      imgEl.src = reader.result;
    });
    // 画像ファイルとして読み込み
    reader.readAsDataURL(file);
  })
}
lesson27();

/**
 *  Lesson 28  ラジオボタンの情報を取得
 **/
function lesson28() {
  const element = document.querySelector('form#radioGroup');

  // 現在の選択状態を取得
  const value = element.fruit.value;
  document.querySelector('.lesson28 .log').innerHTML = `fruitの値は ${value}`;

  // 変化したら反映させる
  element.addEventListener('change', (event) => {
    document.querySelector('.lesson28 .log').innerHTML = `fruitの値は ${event.target.value}`;
  })
}
lesson28();

/**
 *  Lesson 29 ドロップダウンメニューの情報を取得したい
 **/
function lesson29() {
  const element = document.querySelector('#mySelect');

  // 現在の選択状態を取得
  const value = element.value;
  document.querySelector('.lesson29 .log').innerHTML = `選択されているのは ${value}`;

  // 変化したら反映させる
  element.addEventListener('change', (event) => {
    document.querySelector('.lesson29 .log').innerHTML = `選択されているのは ${event.target.value}`;
  })
}
lesson29();

/**
 *  Lesson 30 スライダーの情報を取得したい
 **/
function lesson30() {
  const element = document.querySelector('#myRange');

  // 現在の選択状態を取得
  const value = element.value;
  document.querySelector('.lesson30 .log').innerHTML = `選択されているのは ${value}`;

  // 変化したら反映させる
  element.addEventListener('input', (event) => {
    document.querySelector('.lesson30 .log').innerHTML = `選択されているのは ${event.target.value}`;
  })
}
lesson30();
/**
 *  Lesson 31
 **/
function lesson31() {
  const PREF_LIST = [
    { value: 1, name: '北海道' },
    { value: 2, name: '青森県' },
    { value: 3, name: '岩手県' },
    { value: 4, name: '宮城県' },
    { value: 5, name: '秋田県' },
    { value: 6, name: '山形県' },
  ]
  
  // 現在の選択状態を取得
  const element = document.querySelector('#pref');
  let optionString = '<option value="">選択してください</option>';
  PREF_LIST.forEach((item) => {
    optionString += `<option value="${item.value}">${item.name}</option>`;
  });
  element.innerHTML = optionString;

  // 変化したら反映させる
  element.addEventListener('change', (event) => {
    const value = event.target.value
    const selectedPref = PREF_LIST.filter(item => item.value == value)[0]
    const message = value === '' ? '選択されてません' : `選択されているのは ${selectedPref.value}: ${selectedPref.name} です`;
    document.querySelector('.lesson31 .log').innerHTML = message;
  })
}
lesson31();

/**
 *  Lesson 32
 **/
function lesson32() {
  const formElement = document.querySelector('.lesson32 form');
  formElement.addEventListener('submit', handleSubmit);
  function handleSubmit(event) {
    console.log(event)
    const isYes = confirm(`この内容で送信していいですか？\n${event.target[0].value}`);
    if (isYes == true) {
      // 送信されたらページが更新される。
    } else {
      event.preventDefault(); // 挙動をキャンセル
    }
  }
}
lesson32();
/**
 *  Lesson 33
 **/

/**
 *  Lesson 34
 **/

/**
 *  Lesson 35
 **/

/**
 *  Lesson 36
 **/

/**
 *  Lesson 37
 **/

/**
 *  Lesson 38
 **/

/**
 *  Lesson 39
 **/

/**
 *  Lesson 40
 **/