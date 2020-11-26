import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  projectPageList(param) {
    return this._ajaxPost('gateway/project-service/project/query/projectPageList', param);
  }

  createProject(param) {
    return this._ajaxPost('gateway/project-service/project/create/project', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  getUserList(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listTenantUser', param);
  }

  projectUserList(param) {
    return this._ajaxPost('gateway/system-service/sys/user/projectUserList', param);
  }

  projectDetail(param) {
    return this._ajaxPost('gateway/project-service/project/query/projectDetail', param);
  }

  addProjectUser(param) {
    return this._ajaxPost('gateway/project-service/project/add/projectUser', param);
  }

  removeProjectUser(param) {
    return this._ajaxPost('gateway/project-service/project/remove/projectUser', param);
  }

  summaryList(param) {
    return this._ajaxPost('gateway/project-service/project/query/summaryList', param);
  }

  timeSheetList(param) {
    return this._ajaxPost('gateway/project-service/project/query/timeSheetList', param);
  }

  approvalTimeSheetList(param) {
    return this._ajaxPost('gateway/project-service/project/query/approvalTimeSheetList', param);
  }

  timeSheet(param) {
    return this._ajaxPost('gateway/project-service/project/submit/timeSheet', param);
  }

  approvaledTimeSheetList(param) {
    return this._ajaxPost('gateway/project-service/project/approval/timeSheetList', param);
  }

  setProjectManager(param) {
    return this._ajaxPost('gateway/project-service/project/update/setProjectManager', param);
  }

  projectUserRelation(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryProjectUserRelation', param);
  }

  closeProject(param) {
    return this._ajaxPost('gateway/project-service/project/close/project', param);
  }

  queryByCodes(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryByCodes', param);
  }

  selectWeeklyTimeSumByUserId(param) {
    return this._ajaxPost('gateway/project-service/project/query/selectWeeklyTimeSumByUserId', param);
  }

  timeSheetListapproval(param) {
    return this._ajaxPost('gateway/project-service/project/approval/timeSheetList', param);
  }
}