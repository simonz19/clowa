process.env.NODE_ENV = 'production';
const cwd = process.cwd();
const { c: compress, a: analyser } = require('yargs-parser')(process.argv.slice(2));

const config = require('./config/webpack.prod')(cwd, { compress, analyser });
const mergedConfig = require('./utils/mergeRuntimeConfig')(config, cwd);

require('./runBuild')(mergedConfig.toConfig());
