const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api1': {
        target: 'http://43.138.59.170:5004',
        changeOrigin: true,
        pathRewrite: {'^/api1': ''}
      },
      '/api2': {
        target: 'http://43.138.59.170:6258',
        changeOrigin: true,
        pathRewrite: {'^/api2': ''}
      },
      '/api3': {
        target: 'http://43.138.59.170:6260',
        changeOrigin: true,
        pathRewrite: {'^/api3': ''}
      }
    }
  }
})
