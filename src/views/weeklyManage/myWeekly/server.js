import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询日历
  getCalendar(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  // 查询项目:旧的
  getProjectList(param) {
    return this._ajaxPost('gateway/weekly-service/project/queryName', param);
  }

  // 查询周报
  queryWeekly(param) {
    return this._ajaxPost(`gateway/weekly-service/weekly/get?weeklyId=${param.weeklyId}`, param);
  }

  // 查询团队目标、个人目标
  queryTeamOrPersonalTarget(param) {
    // return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
    return this._ajaxPost('gateway/talent-query/okr/query/weekly/userOkr', param);
  }

  // 查部门okr
  getOrgOkr(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/getUndertakeOkr', param);
  }
  // getorgOkr(param) {
  //   return this._ajaxPost('gateway/talent-query/okr/query/orgOkr', param);
  // }

  // 获取公司价值观
  getValues(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }

  // 保存周报
  commitWeekly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/save', param);
  }

  // 查询周报配置是简单版还是标准版
  getTypeConfig(param) {
    return this._ajaxPost('gateway/system-service/sys/config/query', param);
  }

  // 查询项目
  queryOrgProject(param) {
    return this._ajaxPost('gateway/project-service/project/query/userProjectList', param);
  }

  // 查询项目组织
  queryOrg(param) {
    return this._ajaxPost('gateway/weekly-service/project/org', param);
  }
}
