function create() {
  const text = document.getElementById('text');
  if (text.value !== '') {
    // ul取得
    const ul = document.getElementById('result');

    // 要素を作成
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.innerHTML = text.value;
    li.appendChild(p);
    ul.appendChild(li);
  } else {
    console.log('textareaは空です。');
  }
}

document.querySelector('#btn1').addEventListener('click', create);