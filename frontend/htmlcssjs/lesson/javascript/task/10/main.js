
/** 定義 */
const defaultTime = 10000;  // 10秒
const intervalTime = 10;

let countDownTime = defaultTime;  
let startTime;        // start選択時の時間
let elapsedTime = 0;  // 経過時刻を更新するための変数
let timeToadd = 0;    // タイマーをスタートさせてからストップした間の時間
let timerId = null;     // TimerID

const result = document.getElementById('result');
updateTime(countDownTime);

const startBtn = document.querySelector('#btn1');
const stopBtn = document.querySelector('#btn2');
const resetBtn = document.querySelector('#btn3');
startBtn.addEventListener('click', timeStart);
stopBtn.addEventListener('click', timeStop);
resetBtn.addEventListener('click', timeReset);
buttonControl('neutral');

/** buttonの押下制御 */
function buttonControl(type) { 
  switch (type) {
    case 'start':
      startBtn.setAttribute('disabled', 'true');
      stopBtn.removeAttribute('disabled');
      resetBtn.setAttribute('disabled', 'true');
      break;
    case 'stop':
      startBtn.removeAttribute('disabled');
      stopBtn.setAttribute('disabled', 'true');
      resetBtn.removeAttribute('disabled');
      break;
    case 'reset':
      startBtn.removeAttribute('disabled');
      stopBtn.setAttribute('disabled', 'true');
      resetBtn.setAttribute('disabled', 'true');
      break;
    case 'neutral':
      startBtn.removeAttribute('disabled');
      stopBtn.setAttribute('disabled', 'true');
      resetBtn.setAttribute('disabled', 'true');
      break
    default:
      break
  }
}

/** スタート */
function timeStart() {
  buttonControl('start');
  startTime = Date.now();
  timerId = setInterval(() => {
    elapsedTime = countDownTime - (Date.now() - startTime + timeToadd);
    updateTime(elapsedTime);
    if (elapsedTime < 0) {
      timeStop();
      timeReset();
    }
  }, intervalTime);
}

function updateTime(time) {
  let m = Math.floor(time / 60000);
  let s = Math.floor(time % 60000 / 1000);
  let ms = time % 1000;
  m = ('0' + m).slice(-2); 
  s = ('0' + s).slice(-2);
  ms = ('0' + ms).slice(-3);
  result.innerHTML = m + ':' + s + ':' + ms;
}

/** ストップ */
function timeStop() { 
  if (timerId != null) {
    buttonControl('stop');
    clearInterval(timerId);
    timeToadd += Date.now() - startTime;
  }
}

/** リセット */
function timeReset() { 
  if (timerId != null) {
    buttonControl('reset');
    elapsedTime = 0;
    timeToadd = 0;
    countDownTime = defaultTime;
    updateTime(countDownTime);
  }
}

