const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /talent-gateway-service/account-service/outside/login': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      STRING: '11eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTY1OTY0NTUsInVzZXJJZCI6InVzZXIwMDEifQ.Ao4mKjIXFDZwfjzxvpsMJsEj9Jfgui0ztgEDTFNHerw',
    })));
  },
  // 查询组织树
  'POST /gateway/talent-query/okr/outside/query/orgTable': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      children: [
        {
          createTime: null,
          orgAvailable: 0,
          orgFullId: '11-88',
          orgId: '88881111',
          orgName: '智慧技术部',
          orgParentId: '8888',
          orgType: 0,
          tenantId: null,
          updateTime: null,
          children: [
            {
              createTime: '2020-08-04 16:29:54',
              orgAvailable: 0,
              orgFullId: '11-11-88',
              orgId: '888811111111',
              orgName: '工业互联网平台',
              orgParentId: '88881111',
              orgType: 0,
              tenantId: '88888888',
              updateTime: null,
            },
            {
              createTime: '2020-08-04 16:29:54',
              orgAvailable: 0,
              orgFullId: '22-11-88',
              orgId: '888811112222',
              orgName: '大数据平台',
              orgParentId: '88881111',
              orgType: 0,
              tenantId: '88888888',
              updateTime: null,
            },
            {
              createTime: '2020-08-04 16:29:54',
              orgAvailable: 0,
              orgFullId: '33-11-88',
              orgId: '888811113333',
              orgName: '人工智能平台',
              orgParentId: '88881111',
              orgType: 0,
              tenantId: '88888888',
              updateTime: null,
            },
          ],
        },
        {
          createTime: null,
          orgAvailable: 0,
          orgFullId: '22-88',
          orgId: '88882222',
          orgName: '华润云',
          orgParentId: '8888',
          orgType: 0,
          tenantId: null,
          updateTime: null,
          children: [{
            createTime: '2020-08-04 16:29:54',
            orgAvailable: 0,
            orgFullId: '11-22-88',
            orgId: '888822221111',
            orgName: '磐云',
            orgParentId: '88882222',
            orgType: 0,
            tenantId: '88888888',
            updateTime: null,
          },
          ],
        },
      ],
      createTime: null,
      orgAvailable: 0,
      orgFullId: '88',
      orgId: '8888',
      orgName: '润联科技',
      orgParentId: null,
      orgType: 0,
      tenantId: null,
      updateTime: null,
    })));
  },
};
module.exports = mockData;