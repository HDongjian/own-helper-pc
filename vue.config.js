const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  devServer: {
    port: 4008,
    // proxy: 'https://helper.hdongyu.com',
    // proxy: 'http://47.104.69.49/api',
    proxy: {
      // '/files': {
      //   target: 'https://helper.hdongyu.com',
      //   changeOrigin: true
      // },
      '/api': {
        target: 'http://localhost:3008',
        changeOrigin: true
      }
    },
    open: false
  },
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
