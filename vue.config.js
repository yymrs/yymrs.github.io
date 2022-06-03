function resolve(dir) {
  return require('path').join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
	lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') { //生产环境取消 console.log
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@components', resolve('src/components'))
      .set('@mixins', resolve('src/mixins'))
      .set('@router', resolve('src/router'))
      .set('@static', resolve('src/static'))
      .set('@store', resolve('src/store'))
      .set('@styles', resolve('src/styles'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'))
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
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
    
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true,
      }
    }
  },
  devServer: {
    port: 3001,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: "http://localhost:8080/",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}