const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  // 代理配置
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://aqms-dev.autodev.aas/mojo-gateway',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '' // ，将"以/api开头"的字符串替换为“”
        }
      }
    }
  }
}
