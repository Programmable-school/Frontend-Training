
const container = document.querySelector('.container');
for (let i = 0; i < 10; i++) {
  const img = document.createElement('img');  // imageオブジェクトを作る
  img.src = `images/photo-${i}.jpg`;          // src属性のphotoの画像pathを設定
  container.appendChild(img);                 // containerの要素へimgを追加する
}