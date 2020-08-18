const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /system-service/sys/okr/query': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|10': [{
        periodName: '第一周期',
        startTime: '@datetime()',
        endTime: '@datetime()',
        checkStatus: '开启',
      }],
    })));
  },
};
module.exports = mockData;