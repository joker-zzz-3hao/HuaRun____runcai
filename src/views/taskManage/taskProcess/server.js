import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // 查询所有任务过程
  queryTaskProcessList(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/queryProcess', param);
  }

  // 查询组织包含的用户列表
  queryTaskList(param) {
    return this._ajaxPost('gateway/task-service/task/selectTaskForKanban', param);
  }

  // 查询任务过程的步骤
  queryTaskStep(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcessStep/queryProcessStep', param);
  }
}
