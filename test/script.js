/* 初始化数据库 */
const dbName = 'Test';
const version = 1;
const idx = [
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
function initDb(){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        resolve(true);
      },
      error: function(event){
        reject(event.target.error);
      },
      upgradeneeded: function(event){
        this.createObjectStore('table_1', 'id', idx);
        this.createObjectStore('table_2', 'id', idx);
        this.createObjectStore('table_3', 'id', idx);
        this.createObjectStore('table_4', 'id', idx);
        resolve(true);
      }
    });
  }).catch((err)=>{
    console.error(err);
  });
}

/* 初始化数据库表 */
function initTable(name, data){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const store = this.getObjectStore(name, true);
        store.add(data);
        this.close();
        resolve(true);
      }
    });
  });
}

/* 获取数据 */
function getData(name, value){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const _this = this;
        const store = this.getObjectStore(name);
        store.get(value, function(event){
          _this.close();
          resolve(event.target.result);
        });
      }
    });
  });
}

/* 更新数据 */
function putData(name, data){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const store = this.getObjectStore(name, true);
        store.put(data);
        this.close();
        resolve(true);
      }
    });
  });
}

/* 利用游标查找数据 */
function cursorData(name){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const _this = this;
        const data = [];
        const store = this.getObjectStore(name, true);
        store.cursor('username', function(event){
          const result = event.target.result;
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
function queryData(name, index, query){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const _this = this;
        const data = [];
        const store = this.getObjectStore(name, true);
        store.cursor(index, query, function(event){
          const result = event.target.result;
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
function deleteData(name, value){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const store = this.getObjectStore(name, true);
        store.delete(value);
        this.close();
        resolve(true);
      }
    });
  });
}

/* 清除数据库 */
function clearData(name, value){
  return new Promise((resolve, reject)=>{
    IndexedDB(dbName, version, {
      success: function(event){
        const store = this.getObjectStore(name, true);
        store.clear();
        this.close();
        resolve(true);
      }
    });
  });
}