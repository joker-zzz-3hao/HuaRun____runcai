import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryCultureList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }

  addCulture(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/add', param);
  }

  updateCulture(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/update', param);
  }

  deleteCulture(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/delete', param);
  }
}