import IndexedDB from '../../src/index';

const dbName: string = 'Test';
const version: number = 1;
const objectStore: Array<Object> = [
  {
    name: 'username',
    index: 'username'
  },
  {
    name: 'age',
    index: 'age'
  },
  {
    name: 'sex',
    index: 'sex'
  }
];

/* 初始化数据库 */
export function initDb(): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        resolve(true);
      },
      error(event: Event): void{
        reject(event.target.error);
      },
      upgradeneeded(event: Event): void{
        this.createObjectStore('table_1', 'id', objectStore);
        this.createObjectStore('table_2', 'id', objectStore);
        this.createObjectStore('table_3', 'id', objectStore);
        this.createObjectStore('table_4', 'id', objectStore);
        resolve(true);
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/* 初始化数据库表 */
export function initTable(name: string, data: any): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const store: Object = this.getObjectStore(name, true);

        store.add(data);
        this.close();
        resolve(true);
      }
    });
  });
}

/* 获取数据 */
export function getData(name: string, value: any): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const _this: this = this;
        const store: Object = this.getObjectStore(name);

        store.get(value, function(event: Event): void{
          resolve(event.target.result);
          _this.close();
        });
      }
    });
  });
}

/* 更新数据 */
export function putData(name: string, data: any): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const store: Object = this.getObjectStore(name, true);

        store.put(data);
        resolve(true);
        this.close();
      }
    });
  });
}

/* 利用游标查找数据 */
export function cursorData(name: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const _this: this = this;
        const data: [] = [];
        const store: Object = this.getObjectStore(name, true);

        store.cursor('username', function(event: Event): void{
          const result: any = event.target.result;

          if(result){
            data.push(result.value);
            result.continue();
          }else{
            resolve(data);
            _this.close();
          }
        });
      }
    });
  });
}

/* 查找数据 */
export function queryData(name: string, index: string, query: any): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const _this: this = this;
        const data: [] = [];
        const store: Object = this.getObjectStore(name, true);

        store.cursor(index, query, function(event: Event): void{
          const result: any = event.target.result;

          if(result){
            data.push(result.value);
            result.continue();
          }else{
            resolve(data);
            _this.close();
          }
        });
      }
    });
  });
}

/* 删除数据库内的数据 */
export function deleteData(name: string, value: any): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const store: Object = this.getObjectStore(name, true);

        store.delete(value);
        resolve(true);
        this.close();
      }
    });
  });
}

/* 清除数据库 */
export function clearData(name: string, value: any): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        const store: Object = this.getObjectStore(name, true);

        store.clear();
        resolve(true);
        this.close();
      }
    });
  });
}

/* 排序 */
export function quickSort(rawArray: Array, key: string): Array{
  const len: number = rawArray.length;

  if(len <= 1) return rawArray;

  const basic: Object = rawArray[0];
  const value: any = key ? basic[key] : basic;

  let left: [] = [];
  let right: [] = [];

  for(let i: number = 1; i < len; i++){
    const item: Object = rawArray[i];
    const itemValue: any = key ? item[key] : item;

    if(itemValue < value){
      left.push(item);
    }else{
      right.push(item);
    }
  }

  if(left.length > 1) left = quickSort(left, key);
  if(right.length > 1) right = quickSort(right, key);

  return left.concat(basic, right);
}