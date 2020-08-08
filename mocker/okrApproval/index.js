const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 查询okr审批列表
  'POST /gateway/crcloud-okrManage/getokrApproval': (req, res) => {
    res.send(mockUtil.getSuccessDataPage(Mock.mock({
      'content|10': [{
        Id: '@id()',
        name: '@cname()',
        'okrCycle|1': [1, 2, 3],
        'approvalStatus|1': ['01', '02', '03', '04'],
        'approvalType|1': ['001', '002', '003'],
        okrProgress: '@integer(0, 100)',
        submitTime: '@datetime()',
        approvalTime: '@datetime()',
      }],
    })));
  },
};
module.exports = mockData;