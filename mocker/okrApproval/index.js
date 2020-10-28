const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 查询okr审批列表
  'POST /gateway/talent-query/okr/query/okrApprovalList': (req, res) => {
    res.send(mockUtil.getSuccessDataPage(Mock.mock({
      'content|10': [{
        approvalId: '@id()',
        'approvalStatus|1': [0, 1, 2],
        'approvalType|1': [0, 1],
        approveTime: '@datetime()',
        approveUser: '@cname()',
        createTime: '@datetime()',
        createUser: '@cname()',
        okrProgress: '@integer(0, 100)',
        paramJson: '{"okrBelongType":1,"okrInfoList":[{"cultureId":"","krInfoVoList":[{"okrDetailConfidence":"1","okrDetailObjectKr":"我是一个测试的KRwwtest","okrDetailProgress":0,"okrWeight":100}],"okrDetailObjectKr":"我是一个测试的O wwtest","okrDetailProgress":"0","okrParentDetailId":"","okrWeight":0,"orkDetailParentVersion":"1"}],"periodId":"periodId"}',
        periodId: 'periodId',
        periodName: '2020下半年（2020.7.1-2020.12.31）',
        userName: '@cname()',
      }],
    })));
  },
  // 审批
  'POST /gateway/talent-okr/okr/approval': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      STRING: '审批成功',
    })));
  },
};
module.exports = mockData;