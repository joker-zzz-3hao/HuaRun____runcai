const delay = require('mocker-api/utils/delay');

const proxy = { ...require('./crcloud-demo/index') };

module.exports = (delay(proxy, 1000));
