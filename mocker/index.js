const delay = require('mocker-api/utils/delay');

const proxy = {
  ...require('./crcloud-demo/index'),
  ...require('./role/index'),
  ...require('./okrMaps/index'),
  ...require('./components/index'),
};

module.exports = (delay(proxy, 1000));
