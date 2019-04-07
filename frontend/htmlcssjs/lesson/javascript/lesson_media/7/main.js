// 保存するの選択したときの処理
document.querySelector('#btnSave').addEventListener('click', saveFile);

function saveFile() {
  const fileName = 'mySvg.svg';
  const content = document.querySelector('#mySvg').outerHTML;
  
  // 画像データ
  const dataUrl = 'data:image/svg+xml\n' + encodeURIComponent(content);

  // 文字化け対策
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, content], {type: 'text/plain'});

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else if (window.URL && window.URL.createObjectURL) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(dataUrl, '_blank');
  }
}