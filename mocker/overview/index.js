const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/talent-query/home/org/mainData': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'id|+1': 1,
    })));
  },
  'POST /gateway/system-service/sys/okr/queryPage': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'id|+1': 1,
    })));
  },
  'POST /gateway/weekly-service/weekly/statistic/orgEmotion': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'id|+1': 1,
    })));
  },
  'POST /gateway/weekly-service/weekly/statistic/orgWeekly': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'id|+1': 1,
    })));
  },
};
module.exports = mockData;