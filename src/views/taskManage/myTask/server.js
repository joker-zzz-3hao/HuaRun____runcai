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
  // queryOrgProject(param) {
  //   return this._ajaxPost('gateway/weekly-service/project/queryOrg', param);
  // }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // 查询任务过程
  queryProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/query', param);
  }

  // 暂存任务
  saveTask(param) {
    return this._ajaxPost('gateway/task-service/task/save', param);
  }

  // 删除任务
  deleteTask(param) {
    return this._ajaxPost(`gateway/task-service/task/delete?taskId=${param.taskId}`, param);
  }

  // 归档任务
  filedTask(param) {
    return this._ajaxPost(`gateway/task-service/task/filed?taskId=${param.taskId}`, param);
  }

  // 接收任务
  acceptTask(param) {
    return this._ajaxPost(`gateway/task-service/task/accept?taskId=${param.taskId}`, param);
  }

  // 查询我的任务
  searchMyTask(param) {
    return this._ajaxPost('gateway/task-service/task/selectMyTask', param);
  }

  // 查询我的任务详情
  queryTaskDetail(param) {
    return this._ajaxPost(`gateway/task-service/task/get?taskId=${param.taskId}`, param);
  }

  // 查询任务步骤
  queryProcessStep(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcessStep/queryProcessStep', param);
  }

  // 保存并指派
  appointSave(param) {
    return this._ajaxPost('gateway/task-service/task/appointSave', param);
  }

  // 确认指派
  appoint(param) {
    return this._ajaxPost('gateway/task-service/task/appoint', param);
  }

  // 确认指派
  move(param) {
    return this._ajaxPost('gateway/task-service/task/move', param);
  }

  // 查周报
  selectTaskForWeek(param) {
    return this._ajaxPost('gateway/task-service/task/selectTaskForWeek', param);
  }

  // 查询日历
  getCalendar(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  // 查询项目
  queryOrgProject(param) {
    return this._ajaxPost('gateway/project-service/project/query/userProjectList', param);
  }

  // 查询项目
  removeFile(param) {
    return this._ajaxPost(`gateway/system-service/sys/attachment/remove?resourceId=${param.resourceId}&sourceType=TASK&sourceKey=${param.taskId}`);
  }

  // 校验执行人是否在过程中
  checkUserInProcess(param) {
    return this._ajaxPost('gateway/task-service/task/checkUserInProcess', param);
  }
}
