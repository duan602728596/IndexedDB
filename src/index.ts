import env from './env';
import InitDB from './initDB';
import { CallbackObject } from './types';

declare var webkitIndexedDB: IDBFactory;
declare var mozIndexedDB: IDBFactory;
declare var msIndexedDB: IDBFactory;

function idbFactory(): IDBFactory {
  /* 兼容浏览器和webworker */
  const db: IDBFactory = indexedDB || webkitIndexedDB || mozIndexedDB || msIndexedDB;

  return db;
}

/**
 * 初始化数据库
 * @param { string } name            创建或者连接的数据库名
 * @param { number } version         数据库版本号
 * @param { object } callbackObject  配置回调函数
 *   - success                       创建或者连接的数据库成功后的回调函数
 *   - error                         创建或者连接的数据库失败后的回调函数
 *   - upgradeneeded                 数据库版本号更新后的回调函数
 */
function IndexedDB(name: string, version: number, callbackObject: CallbackObject): InitDB {
  const db: IDBFactory = idbFactory();

  IndexedDB.prototype.indexeddb = db;

  return new InitDB(db, name, version, callbackObject);
}

/**
 * 删除数据库
 * @param { string } databaseName: 数据库名
 */
IndexedDB.deleteDatabase = function(databaseName: string): IDBOpenDBRequest {
  const db: IDBFactory = idbFactory();
  const req: IDBOpenDBRequest = db.deleteDatabase(databaseName);

  if (env === 'development') {
    console.log(`删除数据库：${ databaseName }。`);
  }

  return req;
};

export default IndexedDB;