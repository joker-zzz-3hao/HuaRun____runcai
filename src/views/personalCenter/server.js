import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 修改密码
  updateResetPassword(param) {
    return this._ajaxPost('gateway/system-service/sys/user/updateResetPassword', param);
  }

  queryByTenantIdAndUserId(param) {
    return this._ajaxGet('gateway/privilege-service/privilege/function/queryByTenantIdAndUserId', param);
  }

  // 更新文件状态
  updateResource(param) {
    return this._ajaxPost(`gateway/system-service/sys/attachment/updateResource?resourceId=${param.resourceId}&sourceType=${param.sourceType}`, param);
  }
}
