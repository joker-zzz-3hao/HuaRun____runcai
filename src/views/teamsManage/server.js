import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryTeamBaseInfo(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/queryTeam', param);
  }

  queryOrgParent(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/queryOrgParent', param);
  }

  listOrgUserPage(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/listOrgUserPage', param);
  }

  updateReportRelation(param) {
    return this._ajaxPost('/gateway/system-service/sys/reportRelation/updateReportRelation', param);
  }

  listUserAllOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/listUserAllOrg', param);
  }

  addReportRelation(param) {
    return this._ajaxPost('/gateway/system-service/sys/reportRelation/addReportRelation', param);
  }

  updateVirtualOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/organization/updateVirtualOrg', param);
  }
}