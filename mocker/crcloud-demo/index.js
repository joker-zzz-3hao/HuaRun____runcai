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
  'POST /gateway/crcloud-demo/getokrdata': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|5': [{
        objectName: '@csentence(10, 20)',
        'objectId|+1': 1,
        'percent|+5': 10,
        'progress|+5': 50,
        map: 4,
        'krList|5': [{
          'krId|+1': 1,
          krName: '@csentence(10, 20)',
          'percent|+5': 10,
          'progress|+5': 50,
          'confidence|+1': 1,
        }],

      }],
    })));
  },
};
module.exports = mockData;