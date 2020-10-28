/* eslint-disable indent */
const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 查询数据字典列表
  'POST /gateway/system-service/sys/dictionary/queryOfPage': (req, res) => {
    res.send(mockUtil.getSuccessDataPage(Mock.mock({
      'content|21': [{
        'code|+123': '3',
        'codeId|+1': '324',
        name: '@cname()',
        'enabledFlag|1': ['Y', 'N'],
        description: '@cname()',
        createTime: '@datetime("yyyy-MM-dd")',
      }],
    })));
  },

  // 查询数据字典详情
  'POST /gateway/system-service/sys/dictionary/value/queryOfPage': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|1': [{
        'code|+123': '3',
        'codeId|+1': '324',
        name: '@cname()',
        'enabledFlag|1': ['Y', 'N'],
        description: '@cname()',
        createTime: '@datetime("yyyy-MM-dd")',
        subList: [{
            meaning: '1',
            value: '1',
            orderSeq: '1',
            enabledFlag: 'Y',
            description: '1',
            randomId: '1111', // 添加随机id，用于删除环节
          },
          {
            meaning: '2',
            value: '2',
            orderSeq: '2',
            enabledFlag: 'Y',
            description: '2',
            randomId: '22222', // 添加随机id，用于删除环节
          },
        ],
      }],
    })));
  },
  // 获取用户信息用户
  'POST /gateway/system-service/sys/user/getUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'userId|+1': 1,
      userName: '@cname()',
      userAccount: '@csentence(10, 20)',
      userMobile: /^1[385][1-9]\d{8}/,
      userMail: '@email',
      leader: '8888',
      'userStatus|1': ['0', '50'],
      'userType|1': ['0', '1', '2'],
      'tenantName|1': ['华润', '中信', '万科'],
      'orgId|1': ['1', '1a', '1aa', '1aaa'],
      createTime: '@datetime("yyyy-MM-dd")',
    })));
  },
  // 新增、编辑用户
  'POST /gateway/system-service/sys/dictionary/addOrUpdate': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
  // 删除数据字典
  'POST /gateway/system-service/sys/dictionary/deleteById': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
  // 删除数据字典项
  'POST /gateway/system-service/sys/dictionary/value/deleteById': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
};
module.exports = mockData;
