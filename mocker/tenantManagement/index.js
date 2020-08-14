const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /system-service/sys/tenant/pageTenantList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'content|10': [{
        'tenantId|+1': 1,
        tenantBuId: 'US20190210_111001',
        tenantName: '华润水泥控股有限公司',
        applyUser: '@cname',
        'version|1': ['基础版', '旗舰版'],
        status: 'O', // 状态（O：开通，S：停用，E：过期）
        'mobilePhone|1': ['13531544954', '13632250649', '15820292420', '15999905612'],
        startTime: '@datetime()',
        endTime: '@datetime()',
        createdBy: '1234567890000',
        createTime: '@datetime()',
        updateTime: '@datetime()',
        updateBy: '1234567890000',
      }],
      currentPage: 1,
      pageSize: 10,
      total: 20,

    })));
  },
};
module.exports = mockData;