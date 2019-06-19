process.env.NODE_ENV = 'development';

const config = require('./config/webpack.dev')(process.cwd());

const mergedConfig = require('./utils/mergeRuntimeConfig')(config);

require('./startDev')(mergedConfig.toConfig());
