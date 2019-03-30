/* 浏览器多线程（worker）内测试 */
import { queryData } from './utils';

addEventListener('message', async function(event) {
  const { table, key, age } = event.data.data;
  const result = await queryData(table, key, age);

  postMessage({
    data: result
  });
}, false);