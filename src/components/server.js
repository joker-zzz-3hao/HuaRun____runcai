import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getDepartmentList(param) {
    return this._ajaxPost('gateway/okr/departmentList', param);
  }

  switchorg(param) {
    return this._ajaxPost('gateway/account-service/switch/org', param);
  }

  fuzzyQueryUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/fuzzyQueryUser', param);
  }

  queryOrgAndUser(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/queryOrgAndUser', param);
  }

  unread(param) {
    return this._ajaxPost('gateway/sms-service/innermsg/unread', param);
  }

  addFocus(param) {
    return this._ajaxPost('gateway/talent-okr/okr/focus/add', param);
  }

  // 查询所有任务过程
  queryTaskProcessList(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/query', param);
  }
}