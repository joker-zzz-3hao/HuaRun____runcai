const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/privilege-service/system-service/sys/config/query': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|3': [{
        configType: 'OKR',
        'configTypeDetail|1': ['O-1', 'O-2', 'O-3'],
        'configItemCode|1': ['O', 'S'],
      }],

    })));
  },
};
module.exports = mockData;