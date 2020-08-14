const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /system-service/sys/role/listRolePage': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'content|10': [{
        'roleCode|+1': 1,
        roleName: 'US20190210_111001',
        'roleType|1': ['SYSTEM', 'CREATION'],
        'version|1': ['基础版', '旗舰版'],
        createTime: '@datetime()',
      }],
      currentPage: 1,
      pageSize: 10,
      total: 10,
    })));
  },
  'POST /system-service/sys/userRole/listRoleUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'content|10': [{
        userAccount: '18867671524',
        userName: '@cname',
        userMobile: '18867671524',
        sortPropName: '西天旅游团',
        createTime: '@datetime()',
      }],
      currentPage: 1,
      pageSize: 10,
      total: 10,
    })));
  },
};
module.exports = mockData;