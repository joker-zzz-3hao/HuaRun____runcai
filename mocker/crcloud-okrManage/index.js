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
          cid: 100, okrfid: 0, name: '润联科技', content: '营业额超过100万',
        },
        {
          cid: 101, okrfid: 100, name: '华润云的O', content: '营业额超过100万',
        },
        {
          cid: 102, okrfid: 100, name: '智慧技术', content: '营业额超过100万',
        },
        {
          cid: 103, okrfid: 101, name: '云门户的O', content: '营业额超过100万',
        },
        {
          cid: 104, okrfid: 100, name: 'IT产品服务', content: '营业额超过100万',
        },
        {
          cid: 105, okrfid: 101, name: '云门户的O', content: '营业额超过100万',
        }],
    })));
  },
  // author：林心荃
  // 用于：okr详情
  'POST /gateway/talent-query/okr/query/okrDetail': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      okrMain: {
        'okrId|1': ['111111222', '111111223'],
        'okrBelongType|1': ['0', '1'],
        orgName: '云门户',
        userName: 'lxq',
        userId: '0123',
        updateTime: '2020-08-06',
        okrProgress: '40',
      },
      'okrDetails|2': [
        {
          'detailId|1': ['1233', '1234'],
          'okrDetailObjectKr|1': ['定个小目标', '定两个小目标'],
          okrWeight: '40',
          okrDetailProgress: '30',
          parentObjectKr: '华润云',
          'krList|2': [
            {
              'detailId|': ['1233', '1234'],
              'okrDetailObjectKr|1': ['先赚1个亿', '先赚2个亿'],
              okrWeight: '40',
              okrDetailProgress: '30',
              parentObjectKr: '华润云',
              confidence: '1',
            },
          ],
        },
      ],
      'voteUser|3': [{
        'userId|+1': ['0011', '0022', '0033'],
        'name|1': ['cx', 'tw'],
      }],
    })));
  },
};
module.exports = mockData;