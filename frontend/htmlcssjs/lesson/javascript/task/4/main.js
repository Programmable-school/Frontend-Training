let msg = ''
for(let i = 0; i <= 100; i++) {
  msg += `${i} `
  if (i % 5 === 0 && i !== 0) {
    msg += '<br>'
  }
}
document.querySelector('#result').innerHTML = msg;