const delay = require('mocker-api/utils/delay');

const proxy = {
  ...require('./crcloud-demo/index'),
  ...require('./okrManage/index'),
  ...require('./role/index'),
  ...require('./okrMaps/index'),
  ...require('./components/index'),
  ...require('./common/index'),
  ...require('./okrApproval/index'),
  ...require('./tenantManagement/index'),
  ...require('./roleManage/index'),
  ...require('./okrCycle/index'),
  ...require('./setOkr/index'),
  ...require('./tenantDepartManage/index'),
  ...require('./departManage/index'),
  ...require('./dictionaryManage/index'),
  ...require('./sysUserManage/index'),
  ...require('./weeklyManage/index'),
  ...require('./userManage/index'),
};

module.exports = (delay(proxy, 0));
