import * as mocha from 'mocha';
import './tests/test';

mocha.run();

if(module.hot){
  module.hot.accept();
}