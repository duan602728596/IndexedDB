/* 浏览器多线程（worker）内测试 */
import { queryData } from './utils';

addEventListener('message', async function(event: Event): Promise<void>{
  const { table, key, age }: {
    table: string,
    key: string,
    age: number
  } = event.data.data;
  const result: Object = await queryData(table, key, age);

  postMessage({
    data: result
  });
}, false);