const apiList = {
  mock: 'https://portal-test.crcloud.com',
  sit: 'http://10.200.197.21:8080',
  pre: 'https://portal-pre.crcloud.com',
  prod: 'https://portal-prod.crcloud.com',
};
const api = apiList[process.env.VUE_APP_NODE_ENV];

module.exports = {
  '/talent-gateway-service/*': {
    target: api,
    // target: 'http://10.54.8.13:9081',
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/talent-query/*': {
    // target: 'http://10.54.39.95:8085',
    target: api,
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/gateway': '' },
  },
};
