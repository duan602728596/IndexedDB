# IndexedDB本地数据库

## 使用方法：

### 引入模块
```javascript
import IndexedDB from 'indexeddb-tools';
// 或
window.IndexedDB;
```

### 连接数据库
```javascript
/**
 * name            连接的数据库名
 * version         数据库版本号
 * callbackObject  数据库创建或连接成功后的回调函数
 */
IndexedDB(name, version, callbackObject = {
  success: fn1,         // 数据库连接成功的回调函数
  error: fn2,           // 数据库连接失败的回调函数
  upgradeneeded: fn3    // 数据库首次创建成功的回调函数
});
```
在success或upgradeneeded的回调函数内，可以通过以下方法来获取对应的信息：
```javascript
IndexedDB(name, version, callbackObject = {
  success: function(event){
    this.name;            // 数据库名称
    this.version;         // 数据库版本号
    this.callbackObject;  // 回调函数
    this.db;              // 数据库实例
  }
});

```
### 删除数据库
```javascript
IndexedDB.deleteDatabase(databaseName);
```

### 关闭数据库
```javascript
IndexedDB(name, version, callbackObject = {
  success: function(event){
    this.close();
    // 或
    this.db.close();
  }
});
```

### 数据库创建一个ObjectStore来存储数据
```javascript
IndexedDB(name, version, callbackObject = {
  upgradeneeded: function(event){
    this.createObjectStore(objectStoreName, keyPath, [
      {
        name: name,
        index: index
      }
    ]);
  }
});
```

### 判断是否有ObjectStore
```javascript
this.hasObjectStore(objectStoreName);
```
使用方法：
```javascript
IndexedDB(name, version, callbackObject = {
  upgradeneeded: function(event){
    this.hasObjectStore(objectStoreName);
  }
});
```

### 创建ObjectStore
keyPath作为主键，无法创建索引，值唯一，无法通过游标来查询。
```javascript
this.createObjectStore(objectStoreName, keyPath, indexArray);
```
使用方法：
```javascript
IndexedDB(name, version, callbackObject = {
  upgradeneeded: function(event){
    this.createObjectStore(objectStoreName, keyPath, [
      {
        name: name,        // key
        index: index       // 索引
      }
    ]);
  }
});
```

### 删除ObjectStore
```javascript
this.deleteObjectStore(objectStoreName);
```
使用方法：
```javascript
IndexedDB(name, version, callbackObject = {
  upgradeneeded: function(event){
    this.deleteObjectStore(objectStoreName);
  }
});
```

### 获取ObjectStore
```javascript
this.getObjectStore(objectStoreName, writeAble = false);
```
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName, true); // ObjectStore实例
  }
});
```

### 添加数据
```javascript
store.add(obj);
```
obj的类型可以是Array或者Object。
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName, true);
    store.add({
      [keyPath]: value1
      [name]: value2
    });
    // 或
    store.add([
      {
        [keyPath]: value1
        [name]: value2
      },
      {
        [keyPath]: value1
        [name]: value2
      },
      ...
    ]);
  }
});
```

### 更新数据
```javascript
store.put(obj);
```
obj的类型可以是Array或者Object。
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName, true);
    store.put({
      [keyPath]: value1
      [name]: value2
    });
    // 或
    store.put([
      {
        [keyPath]: value1
        [name]: value2
      },
      {
        [keyPath]: value1
        [name]: value2
      },
      ...
    ]);
  }
});
```

### 查找数据
```javascript
store.get(keyValue, callback);
```
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName);
    store.get(keyValue, function(event){    // 根据主键的值来查找
      const result = event.target.result;
      // ...
    });
  }
});
```

### 删除数据
```javascript
store.delete(value);
```
value可以是string、number或Array。
删除数据是根据主键的值来删除的。
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName, true);
    store.delete(1);
    // 或
    store.delete([1, 'a']);
  }
});
```

### 清除ObjectStore内的数据
```javascript
store.clear();
```
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName, true);
    store.clear();
  }
});
```

### 通过游标查询
```javascript
store.cursor(indexName, [range,] callback);
```
range用来选择范围。
callback回调函数。回调参数为result，result.value为获取的数据，result.continue()继续查找。
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName);
    store.cursor(indexName, function(event){    // 根据其他键索引名称来查找
      const result = event.target.value;
      if(result){
        result.value;       // 查找的数据
        result.continue();  // 继续查找
      }
    });
  }
});
```
查询指定值
使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName);
    store.cursor(indexName, 5, function(result, event){
      // ...
    });
    或
    store.cursor(indexName, 'name', function(event){
      // ...
    });
  }
});
```
根据字符串返回游标查询的范围，
* '>  5'   大于
* '>= 5'   大于等于
* '<  5'   小于
* '<= 5'   小于等于
* '[5, 8]' 闭区间(5 <= x <= 8)
* '(5, 8)' 开区间(5 <  x <  8)

使用方法：
```javascript
IndexedDB(name, version, {
  success: function(event){
    const store = this.getObjectStore(objectStoreName);
    store.cursor(indexName, '(5, 8)', function(event){
      // ...
    });
  }
});
```