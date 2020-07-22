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
      window.$ajax.post(url, param, param && param.userId ? {
        headers: { // 传递租户id，用户id
          userId: param.userId,
          tenantId: param.tenantId,
          crctoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlfdmVyc2lvbiI6IjAwMSIsInVzZXJfaWQiOiI0MzI3NDc4MTk2MzQ0NTQ1MjgiLCJ0Z2Nfa2V5IjoiVEdULTEyMDAtQUJnSUZNdm1XZ29QQjd2N2ZyRG9Odk9mYXNsaTJUQ1hWQmsxUHV1Y1RadW83ZEhydTUtY2FzLXNlcnZlcjItZmZkZjdkYmQ4LTZtcGxjIiwidXNlcl9yZXBvc2l0b3J5IjoiZGVmYXVsdCIsInVzZXJfbmFtZSI6IjQzMjc0NzgxOTYzNDQ1NDUyOCIsInNjb3BlIjpbIlNDT1BFX09ORSIsIlNDT1BFX1RXTyJdLCJleHAiOjE1OTM3NjgxMzEsInByb2RfY29kZSI6IlBPUlRBTCIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwianRpIjoiNzQxZTU2YjgtZDFjYy00ZTVhLTk1N2YtMmYyMjFhNDVmM2YzIiwiY2xpZW50X2lkIjoiUE9SVEFMLmNyYyIsInRlbmFudF9jb2RlIjoiY3JjIn0.tLHNUdqxAcfa7Aqnyi9kMYtmpasUOHlQ6c_fbL3c0NE',
        },
      } : {}).then((response) => {
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
