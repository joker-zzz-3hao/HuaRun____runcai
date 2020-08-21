const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/system-service/sys/tenant/pageTenantList': (req, res) => {
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
  'POST /gateway/system-service/sys/tenant/getTenant': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|1': [{
        tenantId: 'CR0012000206',
        tenantBuId: 'CR0012000206',
        tenantName: '润联科技',
        applyUser: '老侯',
        mobilePhone: '131-0101-0002',
        status: 'Y',
        startTime: '2020-08-05T19:26:26',
        endTime: '2021-08-05T19:26:31',
        createdBy: '1234567890000',
        createTime: '2020-08-06T19:33:07',
        updateTime: '2020-08-06T19:33:11',
        updateBy: '1234567890000',
        menuTree: [[4, 13], [4, 10]],
      },
      ],

    })));
  },
};
module.exports = mockData;