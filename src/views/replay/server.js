import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  okrReviewList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewList', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }
}
