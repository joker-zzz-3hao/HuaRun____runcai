import ServerBase from './node_modules/@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询组织
  getOrg(param) {
    return this._ajaxPost('sys/organization/getOrg', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('sys/user/listUserPage', param);
  }

  // 创建用户
  createUser(param) {
    return this._ajaxPost('sys/user/insertOrgUser', param);
  }

  // 获取用户信息用户
  getUserInfo(param) {
    return this._ajaxPost('sys/user/getUser', param);
  }

  // 编辑用户
  updateOrgUser(param) {
    return this._ajaxPost('sys/user/updateOrgUser', param);
  }

  // 校验是否已被使用
  judgeUser(param) {
    return this._ajaxPost('sys/user/judgeUser', param);
  }

  // 创建部门
  createOrg(param) {
    return this._ajaxPost('sys/organization/insertOrg', param);
  }

  // 设置部门负责人
  setOrgLeader(param) {
    return this._ajaxPost('sys/userRole/addOrgUserLeader', param);
  }
}
