export default class Server {
  constructor() {
    this.error = null;
    this.ERROR_CODE = 500;
    this.ERROR_MSG = '服务异常，请联系管理员';
  }

  _customError() {
    return {
      data: [],
      msg: (this.error.message || this.error.response.data.message || this.ERROR_MSG),
      code: this.ERROR_CODE,
    };
  }

  _ajaxPost(url, param) {
    return new Promise((resolve) => {
      window.$ajax.post(url, param).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        this.error = error;
        resolve(this._customError());
      });
    });
  }

  _ajaxGet(url, param) {
    return new Promise((resolve) => {
      window.$ajax.get(url, param).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        this.error = error;
        resolve(this._customError());
      });
    });
  }
}
