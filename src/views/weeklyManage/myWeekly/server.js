import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询日历
  getCalendar(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  // 查询项目
  getProjectList(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  // 查询周报
  queryWeekly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/get', param);
  }

  // 查询团队目标、个人目标
  queryTeamOrPersonalTarget(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
  }

  // 获取公司价值观
  getValues(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }
}
