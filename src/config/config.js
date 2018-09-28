const hashLength = 6;
const outputName = 'dist';

module.exports = {
  HTMLDirs: ['index', 'secondPage'], // 用来生成对应HTMLWebpackPlugin
  jsFileName: `[name].[chunkhash:${hashLength}].js`, // output用
  assetsFileName: `static/[name].[hash:${hashLength}].[ext]`, //file-loader用
  cssFileName: `[name].[contenthash:${hashLength}].css`, //ExtractTextPlugin用
  cssPublicPath: '/', //ExtractTextPlugin用,配置css内的图片路径
  outputName, // 打包根目录
};
