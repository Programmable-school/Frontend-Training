// fill
function fill() {
  const canvas = document.querySelector('#my-canvas-fill');
  // 2Dコンテキストを取得
  const context = canvas.getContext('2d');
  context.fillStyle = 'red';
  context.fillRect(0, 0, 100, 200);
}

// stroke
function stroke() {
  const canvas = document.querySelector('#my-canvas-stroke');
  // 2Dコンテキストを取得
  const context = canvas.getContext('2d');
  context.lineWidth = 3;
  context.strokeStyle = 'red';
  context.strokeRect(0, 0, 100, 100);
}


fill();
stroke();