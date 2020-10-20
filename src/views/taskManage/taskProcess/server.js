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

  // ..... 编辑任务
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
    return this._ajaxPost('gateway/project-service/project/query/userProjectList', param);
  }

  // 查询任务过程
  queryProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/query', param);
  }

  // 暂存任务
  saveTask(param) {
    return this._ajaxPost('gateway/task-service/task/save', param);
  }

  // 归档任务
  filedTask(param) {
    return this._ajaxPost(`gateway/task-service/task/filed?taskId=${param.taskId}`, param);
  }

  // 归档所有任务
  filedAll(param) {
    return this._ajaxPost(`gateway/task-service/task/filedAll?processId=${param.processId}`, param);
  }

  // 接收任务
  acceptTask(param) {
    return this._ajaxPost(`gateway/task-service/task/accept?taskId=${param.taskId}`, param);
  }

  // 查询我的任务详情
  queryTaskDetail(param) {
    return this._ajaxPost(`gateway/task-service/task/get?taskId=${param.taskId}`, param);
  }

  // 保存并指派
  appointSave(param) {
    return this._ajaxPost('gateway/task-service/task/appointSave', param);
  }

  // 查询任务步骤
  queryProcessStep(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcessStep/queryProcessStep', param);
  }

  // 校验执行人是否在过程中
  checkUserInProcess(param) {
    return this._ajaxPost('gateway/task-service/task/checkUserInProcess', param);
  }

  // 校验分类是否有任务
  deleteCheck(param) {
    return this._ajaxPost(`gateway/task-service/taskProcessType/deleteCheck?typeId=${param.typeId}`);
  }

  // 删除分类
  deleteProcess(param) {
    return this._ajaxPost(`gateway/task-service/taskProcessType/delete?typeId=${param.typeId}`);
  }
}
