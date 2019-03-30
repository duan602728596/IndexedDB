declare var process: {
  env: {
    NODE_ENV: string;
  };
} | undefined;

/* 环境变量 */
const env: string = typeof process === 'object' ? (
  (process.env && process.env.NODE_ENV) ? process.env.NODE_ENV : 'production'
) : 'production';

export default env;