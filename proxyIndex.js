const apiList = {
  mock: 'https://portal-test.crcloud.com',
  sit: 'https://portal-test.crcloud.com',
  pre: 'https://portal-pre.crcloud.com',
  prod: 'https://portal-prod.crcloud.com',
};
const api = apiList[process.env.VUE_APP_NODE_ENV];

module.exports = {
  '/talent-gateway-service/*': {
    // target: api,
    target: 'http://10.54.8.13:9081',
    secure: false,
    changeOrigin: true,
    // pathRewrite: { '^/gateway': '' },
  },
  '/gateway/crcloud-account/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-privilege/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/account-admin/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-cert/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { "^/gateway": "" }
  },
  '/gateway/crcloud-workorder/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { "^/gateway": "" }
  },
  '/gateway/crcloud-sms/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { "^/gateway": "" }
  },
  '/gateway/crcloud-feedback/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { "^/gateway": "" }
  },
  '/gateway/crcloud-product/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-order/*': {
    target: api,
    secure: false,
    changeOrigin: true,
    // pathRewrite: { "^/gateway": "" }
  },
  '/gateway/crcloud-storage/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-face/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-search/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-cmp/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/cas/*': {
    target: 'https://cas-test.crcloud.com',
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-sellercenter/*': {
    target: 'https://market-test.crcloud.com',
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-market-product/*': {
    target: 'https://market-test.crcloud.com',
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-market-order/*': {
    target: 'https://market-test.crcloud.com',
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-market-apimodule/*': {
    target: 'https://market-test.crcloud.com',
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-consult-order/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
  '/gateway/crcloud-process/*': {
    target: api,
    secure: false,
    changeOrigin: true,
  },
};
