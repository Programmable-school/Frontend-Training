
const btn = document.querySelector('button');
btn.addEventListener('click', () => {
  async function load() {
    const url = 'https://blockchain.info/ticker?cors=true'
    const data = await fetch(url);
    const obj = await data.json();
    console.log(obj);
    document.querySelector('#log').innerHTML = JSON.stringify(obj, null, '  ');
  }
  load();
});