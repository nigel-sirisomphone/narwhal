const gulp = require('gulp')
const gutil = require('gulp-util')

const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

gulp.task('default', ['build'])

// BUILD-DEV
gulp.task('build-dev', ['webpack:build-dev'], () => {
  gulp.watch(['src/**/*'], ['webpack:build-dev'])
})

// BUILD
gulp.task('build', ['webpack:build'])

// WEBPACK
function noop() {}

function handleWebpack(name, config, callback) {
  callback = callback || noop

  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError(name, err)

    gutil.log(`[${name}]`, stats.toString({
      colors: true
    }))

    callback()
  })
}

// WEBPACK:BUILD
gulp.task('webpack:build', callback => {
  const webpackProdConfig = Object.assign({}, webpackConfig, {
    plugins: webpackConfig.plugins.concat(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    )
  })

  handleWebpack('webpack:build', webpackProdConfig, callback)
})

// WEBPACK:BUILD-DEV
gulp.task('webpack:build-dev', callback => {
  const webpackDevConfig = Object.assign({}, webpackConfig, {
    cache: false,
    devtool: 'sourcemap',
    debug: true
  })
  
  handleWebpack('webpack:build-dev', webpackDevConfig, callback)
})