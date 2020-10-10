import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  projectPageList(param) {
    return this._ajaxPost('gateway/project-service/project/query/projectPageList', param);
  }

  createProject(param) {
    return this._ajaxPost('gateway/project-service/project/create/project', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }
}