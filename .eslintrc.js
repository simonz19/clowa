module.exports = {
  parser: 'babel-eslint',
  extends: ["airbnb-base/legacy"],
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {},
  rules: {
    "linebreak-style": [0, "unix"],
    "global-require": [0],
    "no-console": [0]
  }
};
