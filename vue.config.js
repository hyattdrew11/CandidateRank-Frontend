module.exports = {
    runtimeCompiler: true,
    devServer: {
       headers: {
      'secretKey':  'myprecious'
      },
      proxy: {
        '/api': {
          target: 'http://3.235.84.235:5000',
          ws: true,
          changeOrigin: true,
          logLevel: 'debug' // this what you want
        }
      },

    }
  }