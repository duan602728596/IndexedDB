const expect = chai.expect;

function quickSort(rawArray, key){
  const len = rawArray.length;
  if(len <= 1) return rawArray;

  const basic = rawArray[0];
  const value = key ? basic[key] : basic;

  let left = [];
  let right = [];

  for(let i = 1; i < len; i++){
    const item = rawArray[i];
    const v = key ? item[key] : item;

    if(v < value){
      left.push(item);
    }else{
      right.push(item);
    }
  }

  if(left.length > 1) left = quickSort(left, key);
  if(right.length > 1) right = quickSort(right, key);

  return left.concat(basic, right);
}

describe('数据库测试', function(){

  describe('初始化数据库', function(){

    it('初始化', async function(){
      const result = await initDb();
      expect(result).to.be.true;
    });

  });

  describe('数据存储', function(){

    it('test1', async function(){
      const r1 = await initTable('table_1', data1);
      expect(r1).to.be.true;

      const r2 = await getData('table_1', 1);
      const r3 = await getData('table_1', 2);
      const r4 = await getData('table_1', 3);
      expect(r2).to.eql(data1[0]);
      expect(r3).to.eql(data1[1]);
      expect(r4).to.eql(data1[2]);
    });

    it('test2', async function(){
      const r1 = await initTable('table_2', data1);
      const r2 = await putData('table_2', data2);
      const r3 = await cursorData('table_2');
      expect(r1).to.be.true;
      expect(r2).to.be.true;
      expect(quickSort(r3, 'id')).to.eql(data2);
    });

    it('test3', async function(){
      const r1 = await initTable('table_3', data3);
      expect(r1).to.be.true;

      const r2 = await queryData('table_3', 'age', '[18, 32)');
      expect(quickSort(r2, 'id')).to.eql([
        {
          id: 2,
          username: '小红',
          age: 18,
          sex: '女'
        },
        {
          id: 3,
          username: '小丽',
          age: 22,
          sex: '女'
        },
        {
          id: 6,
          username: '葫芦娃',
          age: 20,
          sex: '女'
        }
      ]);

      const r3 = await queryData('table_3', 'username', '小红');
      expect(r3).to.eql([
        {
          id: 2,
          username: '小红',
          age: 18,
          sex: '女'
        }
      ]);

      const r4 = await queryData('table_3', 'age', '>= 30');
      expect(quickSort(r4, 'id')).to.eql([
        {
          id: 4,
          username: '王羲之',
          age: 106,
          sex: '男'
        },
        {
          id: 5,
          username: '舒克',
          age: 32,
          sex: '男'
        }
      ]);

      const r5 = await queryData('table_3', 'sex', '女');
      expect(quickSort(r5, 'id')).to.eql([
        {
          id: 2,
          username: '小红',
          age: 18,
          sex: '女'
        },
        {
          id: 3,
          username: '小丽',
          age: 22,
          sex: '女'
        },
        {
          id: 6,
          username: '葫芦娃',
          age: 20,
          sex: '女'
        }
      ]);

    });

    it('test4', async function(){
      const r1 = await initTable('table_4', data3);
      expect(r1).to.be.true;

      const r2 = await deleteData('table_4', [2, 3]);
      expect(r2).to.be.true;

      const r3 = await cursorData('table_4', 'username');
      expect(quickSort(r3, 'id')).to.eql([
        {
          id: 1,
          username: '小明',
          age: 12,
          sex: '男'
        },
        {
          id: 4,
          username: '王羲之',
          age: 106,
          sex: '男'
        },
        {
          id: 5,
          username: '舒克',
          age: 32,
          sex: '男'
        },
        {
          id: 6,
          username: '葫芦娃',
          age: 20,
          sex: '女'
        }
      ]);

      const r4 = await deleteData('table_4', 6);
      expect(r4).to.be.true;

      const r5 = await getData('table_4', 6);
      expect(r5).to.be.undefined;

      const r6 = await clearData('table_4');
      expect(r6).to.be.true;

      const r7 = await getData('table_4', 1);
      expect(r7).to.be.undefined;

      const r8 = await cursorData('table_4', 'username');
      expect(r8).to.eql([]);
    });

  });

  describe('webWorker', function(){

    it('test1', async function(){
      const work = new Worker('./worker.js');

      work.postMessage({
        data: {
          table: 'table_3',
          key: 'age',
          query: '>=30'
        }
      });

      work.addEventListener('message', function(event){
        expect(quickSort(event.data.data, 'id')).to.eql([
          {
            id: 4,
            username: '王羲之',
            age: 106,
            sex: '男'
          },
          {
            id: 5,
            username: '舒克',
            age: 32,
            sex: '男'
          }
        ]);
        work.terminate();
      }, false);
    });
  });
});