import mocha from 'mocha';

mocha.timeout(180000);
mocha.setup('bdd');

import('./tests/test')
  .then(() => {
    mocha.run();
  });

if (module.hot) {
  module.hot.accept();
}