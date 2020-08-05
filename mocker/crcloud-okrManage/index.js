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
        timecycle: '@datetime("yyyy-MM-dd")',
      }],
    })));
  },
  // author：林心荃
  // 用于：查公司价值观
  'POST /gateway/crcloud-okrManage/getphilosophy': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|4': [{
        'philosophyid|+1': 1,
        'philosophy|1': ['成就客户', '创新成长', '成人达已', '追求极致'],
      }],
    })));
  },
  // author：林心荃
  // 用于：承接地图
  'POST /gateway/crcloud-okrManage/getmaps': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      ARRAY: [
        {
          id: 100, fatherId: 0, name: '润联科技', content: '营业额超过100万',
        },
        {
          id: 101, fatherId: 100, name: '华润云的O', content: '营业额超过100万',
        },
        {
          id: 102, fatherId: 100, name: '智慧技术', content: '营业额超过100万',
        },
        {
          id: 103, fatherId: 101, name: '云门户的O', content: '营业额超过100万',
        },
        {
          id: 104, fatherId: 100, name: 'IT产品服务', content: '营业额超过100万',
        },
        {
          id: 105, fatherId: 101, name: '云门户的O', content: '营业额超过100万',
        }],
    })));
  },
};
module.exports = mockData;