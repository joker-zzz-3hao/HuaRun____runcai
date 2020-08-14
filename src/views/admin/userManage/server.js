import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询所有租户
  getAllTenant(param) {
    return this._ajaxPost('system-service/sys/tenant/listTenant', param);
  }

  // 查询用户列表
  getUserList(param) {
    return this._ajaxPost('system-service/sys/user/listTenantUser', param);
  }

  // 设置部门负责人
  setDepartLeader(param) {
    return this._ajaxPost('system-service/sys/userRole/addUserRole', param);
  }

  // 取消部门负责人
  removeDepartLeder(param) {
    return this._ajaxPost('system-service/sys/userRole/delUserRole', param);
  }

  // 创建用户
  createUser(param) {
    return this._ajaxPost('system-service/sys/user/insertOrgUser', param);
  }

  // 获取用户信息
  getUserInfo(param) {
    return this._ajaxPost('system-service/sys/user/getUser', param);
  }

  // 编辑用户
  updateOrgUser(param) {
    return this._ajaxPost('system-service/sys/user/updateOrgUser', param);
  }

  // 校验是否已被使用
  judgeUser(param) {
    return this._ajaxPost('system-service/sys/user/judgeUser', param);
  }
}
