const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // 查询系统用户
  'POST /gateway/task-service/searchTable': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|5': [{
        'title|1': ['关于润才平台产品市场竞品调研与可行性分析', '关于云市场产品市场竞品调研与可行性分析'],
        createUser: '张三',
        createTime: '@datetime("yyyy-MM-dd hh:mm")',
        'status|1': ['未我收到的-未确认接收', '草稿', '标准任务过程 - 待处理'],
        executeUser: '王五',

      }],
    })));
  },

};
module.exports = mockData;