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

  // 新增自定义任务过程
  addProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/addProcess', param);
  }

  // 编辑自定义任务过程
  editProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/updateProcess', param);
  }

  // 任务过程详情
  queryProcessInfo(param) {
    return this._ajaxPost('gateway/task-service/query', param);
  }

  // 查询任务分类
  queryProcessClassify(param) {
    return this._ajaxPost('gateway/task-service/taskProcessType/queryProcessType', param);
  }

  // 新增任务分类
  addProcessType(param) {
    return this._ajaxPost('gateway/task-service/taskProcessType/addProcessType', param);
  }

  // 编辑、删除任务分类
  updateClassify(param) {
    return this._ajaxPost('gateway/task-service/taskProcessType/updateProcessType', param);
  }

  // 新建任务
  createTask(param) {
    return this._ajaxPost('gateway/task-service/task/save', param);
  }
}
