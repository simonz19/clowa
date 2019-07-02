const { ensureFile } = require('fs-extra');
const { writeFileSync } = require('fs');

module.exports = ({ config, dist }) => () => {
  const str = JSON.stringify(config);
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

  strDup = `${'import { lazy } from "react";\n\n'}export default ${strDup}`;
  ensureFile(dist, () => {
    writeFileSync(dist, strDup);
  });
};
