const delay = require('mocker-api/utils/delay');

const proxy = {
  ...require('./crcloud-demo/index'),
  ...require('./crcloud-okrManage/index'),
  ...require('./role/index'),
  ...require('./okrMaps/index'),
  ...require('./components/index'),
  ...require('./common/index'),
};

module.exports = (delay(proxy, 0));
