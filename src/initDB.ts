import env from './env';
import ObjectStore from './objectStore';
import { CallbackObject, IDBEvent, IndexItem } from './types';

class InitDB {
  indexeddb: IDBFactory;
  name: string;
  version: number;
  callbackObject: CallbackObject;
  db: IDBDatabase | undefined;
  request: IDBOpenDBRequest;

  constructor(indexeddb: IDBFactory, name: string, version: number, callbackObject: CallbackObject) {
    // 数据库实例
    this.indexeddb = indexeddb;
    // 数据库名称
    this.name = name;
    // 版本号
    this.version = version;
    // 回调函数
    this.callbackObject = callbackObject;
    // db实例
    this.db = undefined;

    // 创建或者打开数据库
    this.request = this.indexeddb.open(name, version);

    // 绑定函数
    this.request.addEventListener('success', this.handleOpenDBSuccess.bind(this), false);
    this.request.addEventListener('error', this.handleOpenDBError.bind(this), false);
    this.request.addEventListener('upgradeneeded', this.handleOpenUpgradeneeded.bind(this), false);
  }

  /* 打开数据库成功 */
  handleOpenDBSuccess(event: IDBEvent): void {
    if (this.callbackObject.success) {
      this.db = event.target.result;
      this.callbackObject.success.call(this, event);
    }

    if (env === 'development') {
      console.log(`打开数据库成功！\nname:    ${ this.name }\nversion: ${ this.version }`);
    }
  }

  /* 打开数据库失败 */
  handleOpenDBError(event: any): void {
    if (this.callbackObject.error) {
      console.error(event.target.error.message);
      this.callbackObject.error.call(this, event); // event.target.error
    }

    if (env === 'development') {
      console.log(`打开数据库失败！\nname:    ${ this.name }\nversion: ${ this.version }`);
    }
  }

  /* 更新数据库版本 */
  handleOpenUpgradeneeded(event: IDBEvent): void {
    if (this.callbackObject.upgradeneeded) {
      this.db = event.target.result;
      this.callbackObject.upgradeneeded.call(this, event);
    }

    if (env === 'development') {
      console.log(`数据库版本更新！\nname:    ${ this.name }\nversion: ${ this.version }`);
    }
  }

  /* 关闭数据库 */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = undefined;

      if (env === 'development') {
        console.log(`数据库关闭。\nname:    ${ this.name }\nversion: ${ this.version }`);
      }
    }
  }

  /**
   * 判断是否有ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @return { boolean }
   */
  hasObjectStore(objectStoreName: string): boolean {
    if (this.db) {
      return this.db.objectStoreNames.contains(objectStoreName);
    }

    return false;
  }

  /**
   * 创建ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @param { string } keyPath        : ObjectStore关键字
   * @param { Array<IndexItem> } indexArray      : 添加索引和键值，name -> 索引， index -> 键值
   * @return { this }
   */
  createObjectStore(objectStoreName: string, keyPath: string, indexArray: Array<IndexItem>): this {
    if (this.db) {
      if (!this.hasObjectStore(objectStoreName)) {
        const store: IDBObjectStore = this.db.createObjectStore(objectStoreName, { keyPath });

        // 创建索引键值
        if (indexArray) {
          for (const item of indexArray) {
            store.createIndex(
              item.name, // 索引
              item.index // 键值
            );
          }
        }

        if (env === 'development') {
          console.log(`创建了新的ObjectStore：${ objectStoreName }。`);
        }
      } else {
        console.warn(`ObjectStore：${ objectStoreName }已存在。`);
      }
    }

    return this;
  }

  /**
   * 删除ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @return { this }
   */
  deleteObjectStore(objectStoreName: string): this {
    if (this.db) {
      if (this.hasObjectStore(objectStoreName)) {
        this.db.deleteObjectStore(objectStoreName);

        if (env === 'development') {
          console.log(`删除了新的ObjectStore：${ objectStoreName }。`);
        }
      } else {
        console.warn(`ObjectStore：${ objectStoreName }不存在。`);
      }
    }

    return this;
  }

  /**
   * 获取操作ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @param { boolean } writeAble     : 只读还是读写
   * @return { ObjectStore }
   */
  getObjectStore(objectStoreName: string, writeAble: boolean = false): ObjectStore | undefined {
    if (this.db) {
      return new ObjectStore(this.db, objectStoreName, writeAble);
    }
  }
}

export default InitDB;