const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 获取组织树
  'POST /gateway/system-service/sys/organization/getOrg': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|1': [{
        orgId: '1',
        orgName: '华润集团MOCK',
        orgParentId: '',
        isShow: false,
        sonTree: [{
          orgId: '1a',
          orgName: '分公司',
          orgParentId: '1',
          isShow: false,
          sonTree: [{
            orgId: '1aa',
            orgName: '分公司11111111111',
            orgParentId: '1a',
            isShow: false,
            sonTree: [{
              orgId: '1aaa',
              orgName: '分公司2222222222222',
              orgParentId: '1aa',
              isShow: false,
            }],
          }],
        }],
      }],
    })));
  },
  // 查询组织包含的用户列表
  'POST /gateway/system-service/sys/user/listUserPage': (req, res) => {
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
  'POST /gateway/system-service/sys/user/insertOrgUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
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
  // 编辑用户
  'POST /gateway/system-service/sys/user/updateOrgUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
  // 校验唯一性~
  'POST /gateway/system-service/sys/user/judgeUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },
  // 创建部门
  'POST /gateway/system-service/sys/organization/insertOrg': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },
  // 设置部门负责人
  'POST /system-service/sys/userRole/addUserRole': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },
  // 设置部门负责人
  'POST /system-service/sys/userRole/delUserRole': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({

    })));
  },

};
module.exports = mockData;
