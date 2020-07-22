const Mock = require('mockjs');

module.exports = {
  getJudgeParams(type = 'YN') {
    let result = {};
    if (type == 'YN') {
      result = Mock.mock({
        'result|1': ['Y', 'N'],
      });
    }
    return result;
  },
  getSuccessData(data) {
    const temp = {
      // 后台服务日志线程ID
      logId: 'iamlogid',
      // 接口返回的业务数据
      data: {},
      // 状态码
      code: 200,
      // 返回信息
      msg: '操作成功',
    };
    if (data && data.ARRAY) {
      temp.data = data.ARRAY;
    } else if (data && data.STRING) {
      temp.data = data.STRING;
    } else {
      temp.data = data;
    }
    return temp;
  },
  getSuccessDataPage(data) {
    const temp = {
      // 后台服务日志线程ID
      logId: 'iamlogid',
      // 状态码
      code: 200,
      // 返回信息
      msg: '操作成功',
      // 接口返回的业务数据
      data: {
        // 分页查询回来的数据
        content: [],
        // 每页条数
        pageSize: 10,
        // 当前页数
        currentPage: 1,
        // 数据总数
        total: 50,
      },
    };
    temp.data.content = data.content;
    return temp;
  },
  // 列表行数据详情，包含头信息以及列表信息
  getSuccessFormAndList(data) {
    const temp = {
      // 后台服务日志线程ID
      logId: 'iamlogid',
      // 状态码
      code: 200,
      // 返回信息
      msg: '操作成功',
      // 接口返回的业务数据
      data: {
        // 表单头
        form: {},
        // 不分页列表
        tableList: [],
        // 每页条数
        pageSize: 10,
        // 当前页数
        currentPage: 1,
        // 数据总数
        total: 50,
      },
    };
    temp.data.tableList = data.tableList;
    temp.data.form = data.form;
    return temp;
  },
};
