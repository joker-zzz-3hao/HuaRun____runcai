const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/talent-query/okr/query/period': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|2': [{
        'id|+1': 1,
        'okrCycleName|1': ['2020年上半年(01-01～06-30)', '2020年下半年(07-01～12-30)'], // 产品名称
        okrCycleCode: /[a-z][A-Z][A-Z][A-Z][0-9]/, // 产品编码
        checkStatus: 1,
        createTime: '2020-08-04 14:49:10',
        endTime: '2020-12-31 14:51:38',
        periodDesc: '2020下半年',
        periodId: 'asdasdasd',
        periodName: '2020下半年（2020.7.1-2020.12.31）',
        periodType: 1,
        startTime: '2020-07-01 14:51:33',
        tenantId: '88888888',
        updateTime: null,
      }],
    })));
  },
};
module.exports = mockData;