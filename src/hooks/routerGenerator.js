const { ensureFileSync } = require('fs-extra');
const { writeFileSync } = require('fs');
const prettier = require('prettier');

let tempStr;

module.exports = ({ config, dist }) => () => {
  const str = JSON.stringify(config);
  if (str === tempStr) return;
  tempStr = str;
  let strDup = str;

  const regexp = /"component":"([^"]+)"/gi;

  const chunknameGen = path => path
    .split('/')
    .filter(p => p.indexOf('.') !== 0)
    .join('__');

  let result;
  do {
    result = regexp.exec(str);
    if (result) {
      strDup = strDup.replace(
        result[0],
        `"component":lazy(() => import(/* webpackChunkName: "${chunknameGen(result[1])}" */ "${
          result[1]
        }"))`
      );
    }
  } while (result);
  strDup = prettier.format(strDup, {
    parser: 'json'
  });
  strDup = `${'import { lazy } from "react";\n\n'}export default ${strDup}`;
  ensureFileSync(dist);
  writeFileSync(dist, strDup);
};
