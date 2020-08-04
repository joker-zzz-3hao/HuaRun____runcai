const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /talent-gateway-service/account-service/outside/login': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      STRING: '11eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTY1OTY0NTUsInVzZXJJZCI6InVzZXIwMDEifQ.Ao4mKjIXFDZwfjzxvpsMJsEj9Jfgui0ztgEDTFNHerw',
    })));
  },
};
module.exports = mockData;