let number = 0;

/** 追加 */
function create() {
  const text = document.getElementById('text');
  if (text.value !== '') {
    // ul取得
    const ul = document.getElementById('result');

    // 要素を作成
    const li = document.createElement('li');
    li.setAttribute('id', number);

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'item');
    li.appendChild(input);

    const span = document.createElement('span');
    span.innerHTML = text.value;
    li.appendChild(span);
    ul.appendChild(li);

    number += 1;
  } else {
    console.log('textareaは空です。');
  }
}

/** 削除 */
function remove() { 
  const items = document.getElementsByName('item');

  // 削除するelementを配列へ入れる
  const deleteItems = []
  for (let i = 0; i < items.length; i++){
    if (items[i].checked) {
      let id = items[i].parentNode.id;
      let element = document.getElementById(id);
      deleteItems.push(element)
    }
  }

  // 削除.
  for (let i = 0; i < deleteItems.length; i++){
    deleteItems[i].parentNode.removeChild(deleteItems[i]);
  }
}

document.querySelector('#btn1').addEventListener('click', create);
document.querySelector('#btn2').addEventListener('click', remove);