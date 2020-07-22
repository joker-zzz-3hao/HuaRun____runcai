const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/crcloud-demo/getTable': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'id|+1': 1,
    })));
  },
};
module.exports = mockData;