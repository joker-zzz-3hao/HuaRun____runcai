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

  // 查询群组下租户
  getTenantByGroupId(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/queryDetails', param);
  }

  // 查询可选租户
  queryTenants(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/queryTenants', param);
  }

  // 添加租户到群组
  addTenant(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/addTenant', param);
  }

  // 查询群组列表
  queryOfPage(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/query', param);
  }

  // 设置租户是否是默认
  setDefaultTenant(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/updateTenant', param);
  }

  // 移除租户
  removeTenant(param) {
    return this._ajaxPost('gateway/system-service/tenantGroup/removeTenant', param);
  }
}
