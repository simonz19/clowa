#!/usr/bin/env node

const chalk = require('chalk');
const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);

const nodeVersion = process.versions.node;
const versions = nodeVersion.split('.');
const major = versions[0];
const minor = versions[1];

console.log(
  chalk.cyan(
    `Node version: ${major}.${minor} , clowa version: ${
      require('../package.json').version
    } , shell: ${script} ${args}`
  )
);

var result; // eslint-disable-line
switch (script) {
case '-v':
case '--version':
  console.log(require('../package.json').version);
  break;
case 'build':
case 'server':
case 'test':
  require('atool-monitor').emit();
  result = spawn.sync(
    'node',
    [require.resolve(`../src/${script}`)].concat(args),
      { stdio: 'inherit' } // eslint-disable-line
  );
  process.exit(result.status);
  break;
default:
  console.log(`Unknown script ${chalk.cyan(script)}.`);
  break;
}
process.exit(0);
