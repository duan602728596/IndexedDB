/* 浏览器多线程（worker）内测试 */
importScripts('../build/IndexedDB-tools.js');
importScripts('./script.js');

console.log('%cWebWorker', 'color: #f00;');

addEventListener('message', async function(event){
  const { table, key, age } = event.data.data;
  const r3 = await queryData(table, key, age);
  postMessage({
    data: r3
  });
}, false);