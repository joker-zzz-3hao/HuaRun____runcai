import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  searchTable(param) {
    return this._ajaxPost('gateway/task-service/searchTable', param);
  }

  // 查询okr
  queryOkr(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
  }

  // 查询项目组织
  queryOrg(param) {
    return this._ajaxPost('gateway/weekly-service/project/org', param);
  }

  // 查询项目
  queryOrgProject(param) {
    return this._ajaxPost('gateway/weekly-service/project/queryOrg', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // 查询任务过程
  queryProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/queryProcess', param);
  }

  // 暂存任务
  saveTask(param) {
    return this._ajaxPost('gateway/task-service/task/save', param);
  }

  // 暂存任务
  deleteTask(param) {
    return this._ajaxPost(`gateway/task-service/task/delete?taskId=${param.taskId}`, param);
  }

  // 查询我的任务
  searchMyTask(param) {
    return this._ajaxPost('gateway/task-service/task/selectMyTask', param);
  }

  // 查询我的任务详情
  queryTaskDetail(param) {
    return this._ajaxPost(`gateway/task-service/task/get?taskId=${param.taskId}`, param);
  }
}