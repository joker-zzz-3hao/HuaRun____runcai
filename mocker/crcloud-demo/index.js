const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/crcloud-demo/getTable': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'id|+1': 1,
    })));
  },
  'POST /gateway/crcloud-demo/getHistory': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|10': [{
        name: '@cname',
        timestamp: '@datetime("yyyy-MM-dd H:m:s")',
        comments: '@csentence(8,15)',
      }],
    })));
  },
};
module.exports = mockData;