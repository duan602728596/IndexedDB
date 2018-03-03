/**
 * 获取IDBKeyRange
 * 根据字符串返回游标查询的范围，例如：
 * '5'      等于rollup
 * '>  5'   大于
 * '>= 5'   大于等于
 * '<  5'   小于
 * '<= 5'   小于等于
 * '[5, 8]' 闭区间
 * '(5, 8)' 开区间
 * @param { string } range: 传递字符串
 * @return
 */
function getRange(range: any): any{

  if(typeof range === 'number'){

    return range;

  }else if(typeof range === 'string'){
    // 对字符串进行判断

    // 大于
    if(/^\s*>\s*(-?\d+(\.\d+)?)\s*$/i.test(range)){
      return IDBKeyRange.lowerBound(Number(range.match(/(-?\d+(\.\d+)?)/g)[0]), true);
    }

    // 大于等于
    if(/^\s*>\s*=\s*(-?\d+(\.\d+)?)\s*$/i.test(range)){
      return IDBKeyRange.lowerBound(Number(range.match(/(-?\d+(\.\d+)?)/g)[0]));
    }

    // 小于
    if(/^\s*<\s*(-?\d+(\.\d+)?)\s*$/i.test(range)){
      return IDBKeyRange.upperBound(Number(range.match(/(-?\d+(\.\d+)?)/g)[0]), true);
    }

    // 小于等于
    if(/^\s*<\s*=\s*(-?\d+(\.\d+)?)\s*$/i.test(range)){
      return IDBKeyRange.upperBound(Number(range.match(/(-?\d+(\.\d+)?)/g)[0]));
    }

    // 判断区间
    if(/^\s*[\[\(]\s*(-?\d+(\.\d+)?)\s*\,\s*(-?\d+(\.\d+)?)\s*[\]\)]\s*$/i.test(range)){

      const [v0, v1]: string[] = range.match(/(-?\d+(\.\d+)?)/g);
      let [isOpen0, isOpen1]: boolean[] = [false, false];

      // 判断左右开区间和闭区间

      if(/^.*\(.*$/.test(range)){
        isOpen0 = true;
      }

      if(/^.*\).*$/.test(range)){
        isOpen1 = true;
      }

      return IDBKeyRange.bound(Number(v0), Number(v1), isOpen0, isOpen1);
    }

    return range;
  }
}

export default getRange;