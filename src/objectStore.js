import getRange from './getRange';

/**
 * 操作objectStore
 * @param { Object } db            : db实例
 * @param { string } objectStoreNam: objectStore名字
 * @param { boolean } writeAble    : 是否只读
 */

class ObjectStore{
  db: Object;
  store: Object;

  constructor(db: Object, objectStoreName: string, writeAble: boolean): this{
    this.db = db;

    const wa: string = writeAble === true ? 'readwrite' : 'readonly';
    const transaction: ObjectStore = this.db.transaction(objectStoreName, wa);

    this.store = transaction.objectStore(objectStoreName);

    return this;
  }

  /**
   * 添加数据
   * @param { Object | Array } arg: 数组添加多个数据，object添加单个数据
   * @return { this }
   */
  add(arg: Array | Object): this{
    const data: Array = arg instanceof Array ? arg : [arg];

    for(let i: number = 0, j: number = data.length - 1; i <= j; i++){
      this.store.add(data[i]);
      if(i === j){
        console.log('数据添加成功');
      }
    }

    return this;
  }

  /**
   * 更新数据
   * @param { Object | Array } arg: 数组添加多个数据，object添加单个数据
   * @return { this }
   */
  put(arg: Array | Object): this{
    const data: Array = arg instanceof Array ? arg : [arg];

    for(let i: number = 0, j: number = data.length - 1; i <= j; i++){
      this.store.put(data[i]);
      if(i === j){
        console.log('数据更新成功');
      }
    }

    return this;
  }

  /**
   * 删除数据
   * @param { string | number | Array } arg: 数组删除多个数据，string、number删除单个数据
   * @return this
   */
  delete(arg: string | number | Array<string | number>): this{
    const data: Array = arg instanceof Array ? arg : [arg];

    for(let i: number = 0, j: number = data.length - 1; i <= j; i++){
      this.store.delete(data[i]);
      if(i === j){
        console.log('数据删除成功');
      }
    }

    return this;
  }

  /* 清除数据 */
  clear(): this{
    this.store.clear();
    console.log('数据清除成功');
    return this;
  }

  /**
   * 获取数据
   * @param { string | number} value: 键值
   * @param { Function } callback   : 获取成功的回调函数
   * @return { this }
   */
  get(value: string | number, callback: Function): this{
    const g: Object = this.store.get(value);
    const success: Function = (event: Event): void=>{
      if(callback) callback.call(this, event);  // event.target.result
    };

    g.addEventListener('success', success, false);
    return this;
  }

  /**
   * 游标
   * @param { string } indexName               : 索引名
   * @param { string | number | boolean } range: 查询范围：有等于，大于等于，小于，小于等于，区间
   * @param { Function } callback              : 查询成功的回调函数
   * @return { this }
   * result.value
   * result.continue()
   */
  cursor(indexName: string, /* range, callback */): this{
    const callback: Function = typeof arguments[1] === 'function' ? arguments[1] : arguments[2];
    const index: Object = this.store.index(indexName);
    const range: ?(string | number | boolean) = arguments[2] ? getRange(arguments[1]) : null;
    const cursor: Object = range === null ? index.openCursor() : index.openCursor(range);
    const success: Function = (event: Event): void=>{
      if(callback) callback.call(this, event); // event.target.result.value && event.target.result.continue()
    };

    cursor.addEventListener('success', success, false);
    return this;
  }
}

export default ObjectStore;