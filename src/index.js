import Init from './init';
import env from './env';

/* 兼容浏览器和webworker */
const indexeddb: IndexedDB = indexedDB || webkitIndexedDB || mozIndexedDB || msIndexedDB;

/**
 * 初始化数据库
 * @param { string } name            创建或者连接的数据库名
 * @param { number } version         数据库版本号
 * @param { Object } callbackObject  配置回调函数
 *   - success                       创建或者连接的数据库成功后的回调函数
 *   - error                         创建或者连接的数据库失败后的回调函数
 *   - upgradeneeded                 数据库版本号更新后的回调函数
 */
type cbObj = {
  success: Function,
  error: Function,
  upgradeneeded: Function
};

function IndexedDB(name: string, version: number, callbackObject: cbObj = {}): Init{
  IndexedDB.prototype.indexeddb = indexeddb;

  return new Init(indexeddb, name, version, callbackObject);
}

/**
 * 删除数据库
 * @param { string } databaseName: 数据库名
 */
IndexedDB.deleteDatabase = function(databaseName: string): void{
  indexeddb.deleteDatabase(databaseName);

  if(env === 'development'){
    console.log(`删除数据库：${ databaseName }。`);
  }
};

export default IndexedDB;