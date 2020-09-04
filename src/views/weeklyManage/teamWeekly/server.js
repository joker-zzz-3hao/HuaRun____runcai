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
    return this._ajaxPost('gateway/weekly-service/weekly/query', param);
  }

  // 周报速看
  lookQuickly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/look', param);
  }
}
