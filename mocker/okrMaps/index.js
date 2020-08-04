const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/okr/okrCycleList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|2': [{
        'id|+1': 1,
        'okrCycleName|1': ['2020年上半年(01-01～06-30)', '2020年下半年(07-01～12-30)'], // 产品名称
        okrCycleCode: /[a-z][A-Z][A-Z][A-Z][0-9]/, // 产品编码
      }],
    })));
  },
};
module.exports = mockData;