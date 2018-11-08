const process = require('process');

const env = process.env.NODE_ENV;

switch(env){
  case 'development':
    require('./config/gulp/gulp.dev')(__dirname);
    break;
  case 'production':
    require('./config/gulp/gulp.pro')(__dirname);
    break;
  default:
    throw new Error('NODE_ENV is error.');
}