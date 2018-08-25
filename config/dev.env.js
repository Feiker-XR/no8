'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://169.56.12.110:9399"',//测试
  BASE_API_CREDIT: '"http://169.56.12.110:9999"',//信用
  BASE_API_OFFICIAL: '"http://169.56.12.110:8399"',//官方
  //BASE_API_CREDIT: '"http://172.16.28.63:9999"',//信用
  //BASE_API_OFFICIAL: '"http://172.16.28.63:8888"',//官方
  //BASE_API: '"http://169.56.12.76:9999"',//生产
  //BASE_API: '"http://172.16.28.63:8888"'//官方测试
})
