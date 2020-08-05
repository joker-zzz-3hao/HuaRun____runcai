const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // author：林心荃
  // 用于：查我的okr
  'POST /gateway/crcloud-okrManage/getokrdata': (req, res) => {
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
          progress: 50,
          'confidence|+1': 1,
        }],
      }],
    })));
  },
  // author：林心荃
  // 用于：查周期
  'POST /gateway/crcloud-okrManage/getTimeCycle': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|4': [{
        'timeid|+1': 1,
        timecycle: '@datetime("yyyy-MM-dd H:m:s")',
      }],
    })));
  },
};
module.exports = mockData;