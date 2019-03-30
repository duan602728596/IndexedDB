import describe from 'describe';
import { expect } from 'chai';
import { data1, data2, data3 } from './data';
import { initDb, initTable, getData, putData, cursorData, queryData, deleteData, clearData, quickSort } from './utils';
import TestWorker from 'worker-loader!./worker';

describe('数据库测试', function() {
  describe('初始化数据库', function() {
    it('初始化', async function() {
      const result = await initDb();

      expect(result).to.be.true;
    });
  });

  describe('数据存储', function() {
    it('test1', async function() {
      const result1 = await initTable('table_1', data1);

      expect(result1).to.be.true;

      const result2 = await getData('table_1', 1);
      const result3 = await getData('table_1', 2);
      const result4 = await getData('table_1', 3);

      expect(result2).to.eql(data1[0]);
      expect(result3).to.eql(data1[1]);
      expect(result4).to.eql(data1[2]);
    });

    it('test2', async function() {
      const result1 = await initTable('table_2', data1);
      const result2 = await putData('table_2', data2);
      const result3 = await cursorData('table_2');

      expect(result1).to.be.true;
      expect(result2).to.be.true;
      expect(quickSort(result3, 'id')).to.eql(data2);
    });

    it('test3', async function() {
      const result1 = await initTable('table_3', data3);

      expect(result1).to.be.true;

      const result2 = await queryData('table_3', 'age', '[18, 32)');

      expect(quickSort(result2, 'id')).to.eql([
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

      const result3 = await queryData('table_3', 'username', '小红');

      expect(result3).to.eql([
        {
          id: 2,
          username: '小红',
          age: 18,
          sex: '女'
        }
      ]);

      const result4 = await queryData('table_3', 'age', '>= 30');

      expect(quickSort(result4, 'id')).to.eql([
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

      const result5 = await queryData('table_3', 'sex', '女');

      expect(quickSort(result5, 'id')).to.eql([
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

    it('test4', async function() {
      const result1 = await initTable('table_4', data3);

      expect(result1).to.be.true;

      const result2 = await deleteData('table_4', [2, 3]);

      expect(result2).to.be.true;

      const result3 = await cursorData('table_4', 'username');

      expect(quickSort(result3, 'id')).to.eql([
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

      const result4 = await deleteData('table_4', 6);

      expect(result4).to.be.true;

      const result5 = await getData('table_4', 6);

      expect(result5).to.be.undefined;

      const result6 = await clearData('table_4');

      expect(result6).to.be.true;

      const result7 = await getData('table_4', 1);

      expect(result7).to.be.undefined;

      const result8 = await cursorData('table_4', 'username');

      expect(result8).to.eql([]);
    });

  });

  describe('webWorker', function() {

    it('test1', function() {
      const work = new TestWorker('./worker.js');

      work.postMessage({
        data: {
          table: 'table_3',
          key: 'age',
          query: '>=30'
        }
      });

      work.addEventListener('message', function(event) {
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