import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryTeamBaseInfo(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/queryTeam', param);
  }
}