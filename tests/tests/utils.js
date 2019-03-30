import IndexedDB from '../../cjs';

const dbName = 'Test';
const version = 1;
const objectStore = [
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
export function initDb() {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        resolve(true);
      },
      error(event) {
        reject(event.target.error);
      },
      upgradeneeded(event) {
        this.createObjectStore('table_1', 'id', objectStore);
        this.createObjectStore('table_2', 'id', objectStore);
        this.createObjectStore('table_3', 'id', objectStore);
        this.createObjectStore('table_4', 'id', objectStore);
        resolve(true);
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}

/* 初始化数据库表 */
export function initTable(name, data) {
  return new Promise((resolve, reject ) => {
    IndexedDB(dbName, version, {
      success(event) {
        const store = this.getObjectStore(name, true);

        store.add(data);
        this.close();
        resolve(true);
      }
    });
  });
}

/* 获取数据 */
export function getData(name, value) {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        const _this = this;
        const store = this.getObjectStore(name);

        store.get(value, function(event) {
          resolve(event.target.result);
          _this.close();
        });
      }
    });
  });
}

/* 更新数据 */
export function putData(name, data) {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        const store = this.getObjectStore(name, true);

        store.put(data);
        resolve(true);
        this.close();
      }
    });
  });
}

/* 利用游标查找数据 */
export function cursorData(name) {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        const _this = this;
        const data = [];
        const store = this.getObjectStore(name, true);

        store.cursor('username', function(event) {
          const result = event.target.result;

          if (result) {
            data.push(result.value);
            result.continue();
          } else {
            resolve(data);
            _this.close();
          }
        });
      }
    });
  });
}

/* 查找数据 */
export function queryData(name, index, query) {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        const _this = this;
        const data = [];
        const store = this.getObjectStore(name, true);

        store.cursor(index, query, function(event) {
          const result = event.target.result;

          if (result) {
            data.push(result.value);
            result.continue();
          } else {
            resolve(data);
            _this.close();
          }
        });
      }
    });
  });
}

/* 删除数据库内的数据 */
export function deleteData(name, value) {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        const store = this.getObjectStore(name, true);

        store.delete(value);
        resolve(true);
        this.close();
      }
    });
  });
}

/* 清除数据库 */
export function clearData(name, value) {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        const store = this.getObjectStore(name, true);

        store.clear();
        resolve(true);
        this.close();
      }
    });
  });
}

/* 排序 */
export function quickSort(rawArray, key) {
  const len = rawArray.length;

  if (len <= 1) return rawArray;

  const basic = rawArray[0];
  const value = key ? basic[key] : basic;

  let left = [];
  let right = [];

  for (let i = 1; i < len; i++) {
    const item = rawArray[i];
    const itemValue = key ? item[key] : item;

    if (itemValue < value) {
      left.push(item);
    } else {
      right.push(item);
    }
  }

  if (left.length > 1) left = quickSort(left, key);
  if (right.length > 1) right = quickSort(right, key);

  return left.concat(basic, right);
}