import ObjectStore from './objectStore';

/* 初始化数据库 */
class Init{
  indexeddb: any;
  name: string;
  version: number;
  callbackObject: {
    success: Function,
    error: Function,
    upgradeneeded: Function
  };

  constructor(indexeddb, name, version, callbackObject): void{
    this.indexeddb = indexeddb;            // 数据库实例
    this.name = name;                      // 数据库名称
    this.version = version;                // 版本号
    this.callbackObject = callbackObject;  // 回调函数
    this.db = null;                        // db实例

    // 创建或者打开数据库
    this.request = this.indexeddb.open(name, version);

    // 绑定函数
    this.request.addEventListener('success', this.openSuccess.bind(this), false);
    this.request.addEventListener('error', this.openError.bind(this), false);
    this.request.addEventListener('upgradeneeded', this.openUpgradeneeded.bind(this), false);
  }

  /* 打开数据库成功 */
  openSuccess(event: Event): void{
    if(this.callbackObject.success){
      this.db = event.target.result;
      this.callbackObject.success.call(this, event);
    }
    console.log(`打开数据库成功！\nname:    ${ this.name }\nversion: ${ this.version }`);
  }

  /* 打开数据库失败 */
  openError(event: Event): void{
    if(this.callbackObject.error){
      console.error(event.target.error.message);
      this.callbackObject.error.call(this, event);    // event.target.error
    }
    console.log(`打开数据库失败！\nname:    ${ this.name }\nversion: ${ this.version }`);
  }

  /* 更新数据库版本 */
  openUpgradeneeded(event: Event): void{
    if(this.callbackObject.upgradeneeded){
      this.db = event.target.result;
      this.callbackObject.upgradeneeded.call(this, event);
    }
    console.log(`数据库版本更新！\nname:    ${ this.name }\nversion: ${ this.version }`);
  }

  /* 关闭数据库 */
  close(): void{
    this.db.close();
    this.db = null;
    console.log(`数据库关闭。\nname:    ${ this.name }\nversion: ${ this.version }`);
  }

  /**
   * 判断是否有ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @return { boolean }
   */
  hasObjectStore(objectStoreName: string): boolean{
    return this.db.objectStoreNames.contains(objectStoreName);
  }

  /**
   * 创建ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @param { string } keyPath        : ObjectStore关键字
   * @param { Array } indexArray      : 添加索引和键值，name -> 索引， age -> 键值
   * @return { this }
   */
  createObjectStore(objectStoreName: string, keyPath: string, indexArray: Array): this{
    if(!this.hasObjectStore(objectStoreName)){
      const store: Object = this.db.createObjectStore(objectStoreName, {
        keyPath: keyPath
      });

      // 创建索引键值
      if(indexArray){
        for(let i: number = 0, j: number = indexArray.length; i < j; i++){
          store.createIndex(
            indexArray[i].name,   // 索引
            indexArray[i].index   // 键值
          );
        }
      }

      console.log(`创建了新的ObjectStore：${ objectStoreName }。`);
    }else{
      console.warn(`ObjectStore：${ objectStoreName }已存在。`);
    }

    return this;
  }

  /**
   * 删除ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @return { this }
   */
  deleteObjectStore(objectStoreName: string): this{
    if(this.hasObjectStore(objectStoreName)){
      this.db.deleteObjectStore(objectStoreName);
      console.log(`删除了新的ObjectStore：${ objectStoreName }。`);
    }else{
      console.warn(`ObjectStore：${ objectStoreName }不存在。`);
    }

    return this;
  };

  /**
   * 获取操作ObjectStore
   * @param { string } objectStoreName: ObjectStore名字
   * @param { boolean } writeAble     : 只读还是读写
   * @return { ObjectStore }
   */
  getObjectStore(objectStoreName: string, writeAble: boolean = false):  ObjectStore{
    return new ObjectStore(this.db, objectStoreName, writeAble);
  };
}

export default Init;