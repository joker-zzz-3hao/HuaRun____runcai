const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/okr/departmentList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|2': [
        {
          label: '润联科技',
          id: '@id()',
          children: [{
            label: '华润云',
            id: '@id()',
            children: [{
              label: '云门户',
              id: '@id()',
            }],
          }, {
            label: 'IT产品服务部',
            id: '@id()',
            children: [{
              label: '润工作',
              id: '@id()',
            }],
          }],
        },
      ],
    })));
  },
};
module.exports = mockData;