import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询所有任务过程
  queryTaskProcessList(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/queryProcess', param);
  }

  // 新增自定义任务过程
  addProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/addProcess', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // ********************************************************************************************
  // 查询数据字典列表
  queryOfPage(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryOfPage', param);
  }

  // 新增、编辑数据字典
  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/addOrUpdate', param);
  }

  // 查询数据字详情典
  queryDicDetail(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/value/queryOfPage', param);
  }

  // 删除数据字典
  deleteDic(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/deleteById', param);
  }

  // 删除数据字典项
  deleteDicItem(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/value/deleteById', param);
  }
}
