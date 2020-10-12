import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  okrReviewList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewList', param);
  }

  getOkrReviewDetail(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/getOkrReviewDetail', param);
  }

  // okr复盘沟通保存
  okrReviewCommunicationSave(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewCommunicationSave', param);
  }

  // okr复盘沟通提交
  okrReviewCommunicationSubmit(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewCommunicationSubmit', param);
  }

  // okr复盘保存
  okrReviewSave(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewSave', param);
  }

  // okr复盘提交
  okrReviewSubmit(param) {
    return this._ajaxPost('gateway/talent-okr//okr/okrReview/okrReviewSubmit', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }
}
