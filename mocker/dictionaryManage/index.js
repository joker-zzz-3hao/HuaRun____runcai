const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 查询数据字典列表
  'POST /system-service/sys/dictionary/queryOfPage': (req, res) => {
    res.send(mockUtil.getSuccessDataPage(Mock.mock({
      'content|21': [{
        'code|+1': '3',
        name: '@cname()',
        'enabledFlag|1': ['Y', 'N'],
        description: '@cname()',
        createTime: '@datetime("yyyy-MM-dd")',
      }],
    })));
  },
  // 查询组织包含的用户列表
  'POST /system-service/sys/user/listUserPage': (req, res) => {
    res.send(mockUtil.getSuccessDataPage(Mock.mock({
      'content|4': [{
        'userId|+1': 1,
        userName: '@cname()',
        userAccount: '@csentence(10, 20)',
        userMobile: /^1[385][1-9]\d{8}/,
        leader: '8888',
        'userStatus|1': ['0', '50'],
        'userType|1': ['0', '1', '2'],
        createTime: '@datetime("yyyy-MM-dd")',
      }],
    })));
  },
  // 创建用户
  'POST /system-service/sys/user/insertOrgUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
  // 获取用户信息用户
  'POST /system-service/sys/user/getUser': (req, res) => {
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
  // 编辑用户
  'POST /system-service/sys/user/updateOrgUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
  // 校验唯一性~
  'POST /system-service/sys/user/judgeUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },
  // 创建部门
  'POST /system-service/sys/organization/insertOrg': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },
  // 设置部门负责人
  'POST /system-service/sys/userRole/addOrgUserLeader': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },

};
module.exports = mockData;
