/* eslint-disable indent */
const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 查询系统用户
  'POST /system-service/sys/user/getAdminUser': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|1': [{
        userAccount: 'admin',
        createTime: '@datetime("yyyy-MM-dd hh:mm:ss")',
      }],
    })));
  },
  // 密码修改
  'POST /system-service/sys/user/updateResetPassword': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({})));
  },
};
module.exports = mockData;
