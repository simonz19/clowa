process.env.NODE_ENV = 'production';

const config = require('./config/webpack.prod')(process.cwd());
const mergedConfig = require('./utils/mergeRuntimeConfig')(config);

require('./runBuild')(mergedConfig.toConfig());
