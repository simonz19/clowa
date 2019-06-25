process.env.NODE_ENV = 'development';
const cwd = process.cwd();

const config = require('./config/webpack.dev')(cwd);

const mergedConfig = require('./utils/mergeRuntimeConfig')(config, cwd);

require('./startDev')(mergedConfig.toConfig());
