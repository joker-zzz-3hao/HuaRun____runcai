import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 新增群组
  addGroup(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/create', param);
  }

  // 编辑群组
  editGroup(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/update', param);
  }

  // 删除群组
  deleteGroup(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/remove', param);
  }

  // 查询群组列表
  queryOfPage(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/query', param);
  }

  // 某个群组已设置的租户
  getTenantList(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryOfPage', param);
  }
}
