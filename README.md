# IndexedDB本地数据库

### 1、创建或连接数据库
```javascript
IndexedDB(name, version, callbackObject = {});
```
name          : 创建或者连接的数据库名  
version       : 数据库版本号  
callbackObject: 配置回调函数
* success：创建或者连接的数据库成功后的回调函数
* error：创建或者连接的数据库失败后的回调函数
* upgradeneeded：数据库版本号更新后的回调函数

创建成功后：
```javascript
IndexedDB(name, version, {
	success: function(et){
		const db = this.db; // 数据库实例
	}
});
```

### 2、删除数据库
```javascript
IndexedDB.deleteDatabase(databaseName);
```

### 3、关闭数据库
```javascript
this.close(time);
```

### 4、判断是否有ObjectStore
```javascript
this.hasObjectStore(objectStoreName);
```

### 5、创建ObjectStore
```javascript
this.createObjectStore(objectStoreName, keyPath, indexArray);
```
indexArray(Array)，里面的对象为(Object)
* index: 索引  
* name:  键值

### 6、删除ObjectStore
```javascript
this.deleteObjectStore(objectStoreName);
```

### 7、获取ObjectStore
```javascript
this.getObjectStore(objectStoreName, writeAble = true);
```
例：
```javascript
IndexedDB(name, version, {
	success: function(){
		const db = this.db;                                 // 数据库实例
		const store = this.getObjectStore(objectStoreName); // ObjectStore实例
	}
});
```

### 8、添加数据
```javascript
store.add(obj);
```
Object或Array，下同。

### 9、修改数据
```javascript
store.put(obj);
```

### 10、删除数据
```javascript
store.delete(value);
```
String、Number或Array。

### 11、查找数据
```javascript
store.get(key, callback);
```
callback回调函数。回调参数为result。


### 12、清除ObjectStore
```javascript
store.clear();
```

### 13、游标
```javascript
store.cursor(indexName, [range,] callback);
```
range用来选择范围。  
根据字符串返回游标查询的范围，例如：
	* '5'      等于
	* '>  5'   大于
	* '>= 5'   大于等于
	* '<  5'   小于
	* '<= 5'   小于等于
	* '[5, 8]' 闭区间
	* '(5, 8)' 开区间
callback回调函数。回调参数为result，result.value为获取的数据，result.continue()迭代。


