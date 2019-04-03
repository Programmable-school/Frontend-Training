const srcMap = new Map();
// DOMContentLoaded: DOMの構築が完了したら発火するイベント
window.addEventListener('DOMContentLoaded', () => {
  const imgs = document.querySelectorAll('img');
  imgs.forEach((img) => {
    srcMap.set(img, img.dataset.src);
    img.removeAttribute('src');
  });
});

const btn = document.querySelector('.btn');
btn.addEventListener('click', () => {
  const imgs = document.querySelectorAll('img');
  imgs.forEach((img) => {
    const source = srcMap.get(img);
    img.src = source;
  });
});