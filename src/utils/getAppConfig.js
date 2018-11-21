// 引入插件
const HTMLWebpackPlugin = require('html-webpack-plugin');

/** 解析路径 */
const _pathResolve = (targetPath, paths) => {
  let nAppPath;
  if (typeof appPath === 'string') {
    nAppPath = paths.resolveApp(targetPath);
  } else if (targetPath instanceof Array) {
    nAppPath = targetPath.map(path => paths.resolveApp(path));
  } else if (targetPath instanceof Object) {
    nAppPath = {};
    for (let key in targetPath) {
      if ({}.hasOwnProperty.call(targetPath, key)) {
        nAppPath[key] = paths.resolveApp(targetPath[key]);
      }
    }
  }
  return nAppPath;
};

/** 获得app配置的entry */
const getEntry = (appEntry, paths) => {
  if (typeof appEntry === 'string') {
    appEntry = { index: appEntry };
  }
  return appEntry;
};

/** 获取htmlWebpackPlugin的模板 */
const getHtmlPlugin = appHtmlPlugin => {
  const HTMLPlugins = [];
  // 生成多页面的集合
  if (appHtmlPlugin) {
    Object.keys(appHtmlPlugin).forEach(key => {
      const { template, chunks = [] } = appHtmlPlugin[key];
      const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${key}.html`,
        template,
        chunks: ['commons'].concat(chunks || []),
      });
      HTMLPlugins.push(htmlPlugin);
    });
    return HTMLPlugins;
  } else {
    // todo 默认找index.ejs
  }
};

module.exports = (appConfig, cwd) => {
  const paths = require('../utils/getPaths')(cwd);
  return {
    entry: getEntry(appConfig.entry, paths),
    htmlPlugin: getHtmlPlugin(appConfig.htmlPlugin, paths),
  };
};
