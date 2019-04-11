const btn = document.querySelector('button');
btn.addEventListener('click', notify);

// 通知を試みる
// http/https でなければ通知はとばない
function notify() {
  switch(Notification.permission) {
    case 'default':
      Notification.requestPermission();
      break;
    case 'granted':
      new Notification('こんにちは');
      break;
    case "denied":
      alert('通知が拒否されています');
      break;
  }
  console.log(Notification.permission);
}