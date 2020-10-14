import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // 查询所有任务过程
  queryTaskProcessList(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/query', param);
  }

  // 任务看板任务
  queryTaskList(param) {
    return this._ajaxPost('gateway/task-service/task/selectTaskForKanban', param);
  }

  // 查询任务列表数据
  queryTaskTableList(param) {
    return this._ajaxPost('gateway/task-service/task/selectTaskForList', param);
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
    return this._ajaxPost('gateway/task-service/task/taskProcess/update', param);
  }

  // 查询任务过程适用人群
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

  // 任务变更分类
  changeClassify(param) {
    return this._ajaxPost('gateway/task-service/task/changeType', param);
  }

  // 任务归档
  finishTask(param) {
    return this._ajaxPost(`gateway/task-service/task/filed?taskId=${param.taskId}`, param);
  }

  // 删除任务
  deleteTask(param) {
    return this._ajaxPost(`gateway/task-service/task/delete?taskId=${param.taskId}`, param);
  }

  // 移动任务步骤
  move(param) {
    return this._ajaxPost('gateway/task-service/task/move', param);
  }

  // 任务换人
  changeUser(param) {
    return this._ajaxPost('gateway/task-service/task/changeUser', param);
  }

  // 查询任务归档接口
  queryFiledList(param) {
    return this._ajaxPost('gateway/task-service/task/selectTaskForFiled', param);
  }
}
