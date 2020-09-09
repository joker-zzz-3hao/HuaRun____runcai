const apiList = {
  mock: 'https://portal-test.crcloud.com',
  sit: 'https://cr-talent-dev.crcloud.com',
  // sit: 'http://10.200.197.21:8080',
  uat: 'https://cr-talent-uat.crcloud.com',
  prod: 'https://portal-prod.crcloud.com',
};
const api = apiList[process.env.VUE_APP_NODE_ENV];
console.log(`api:${api}`);

module.exports = {
  '/gateway/talent-gateway-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '/system-service' },
  },
  '/gateway/system-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '/system-service' },
  },
  '/gateway/privilege-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/account-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/okr-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/data-query/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/talent-query/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/talent-okr/*': {
    target: api,
    // target: 'http://10.54.39.102:8085',
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/weekly-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/sms-service/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
};
