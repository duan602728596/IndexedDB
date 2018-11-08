/* 环境变量 */
const env: string = typeof process === 'object' ? process?.env?.NODE_ENV : 'production';

export default env;