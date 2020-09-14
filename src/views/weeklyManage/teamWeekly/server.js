import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询组织
  getOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/getOrg', param);
  }

  // 查询周报列表
  queryTeamWeeklyList(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/query', param);
  }

  // 提醒写周报
  remindWriteWeekly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/notice', param);
  }

  // 周报速看
  lookQuickly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/look', param);
  }

  // 查询周报
  queryWeekly(param) {
    return this._ajaxPost(`gateway/weekly-service/weekly/get?weeklyId=${param.weeklyId}`, param);
  }

  // 点赞
  support(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/support', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }
}
