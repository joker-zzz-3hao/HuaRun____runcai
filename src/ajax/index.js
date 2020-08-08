import axios from 'axios';
import {
  Message,
} from 'element-ui';

function sessionTimeOut(data) {
  console.log(data);
  // TODO:未授权时跳转ladp登录首页
}

const ajax = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Pragma: 'no-cache',
    token: localStorage.token,
  },
  transformRequest: [(data) => JSON.stringify(data)],
  transformResponse: [(res) => {
    try {
      const data = JSON.parse(res);
      if (typeof data === 'object') {
        // http code判断，只有报错才会进入这里
        if (data && data.status) {
          switch (data.status) {
            case 500:
              Message({
                showClose: true,
                message: data.msg || '系统错误',
                type: 'error',
              });
              break;
            case 302:
            case 504:
            case 510:
              sessionTimeOut(data);
              break;
            case 403:
              Message({
                showClose: true,
                message: data.msg || '您还没有当前功能的使用权限',
                type: 'error',
              });
              break;
            case 200:
            case 201:
            default:
          }
          return data.data || {};
          // 后端正常返回code判断
        }
        if (data && data.code) {
          switch (data.code) {
            case 50000: // 系统错误
              Message({
                showClose: true,
                message: data.msg || '系统错误',
                type: 'error',
              });
              break;
            case 500: // 系统错误
              Message({
                showClose: true,
                message: data.msg || '系统错误',
                type: 'error',
              });
              break;
            case 40000: // 业务操作失败
              Message({
                showClose: true,
                message: data.msg || '操作失败',
                type: 'error',
              });
              break;
            case 10000: // 登录超时
              sessionTimeOut(data);
              break;
            case 20000: // 无权限操作
              Message({
                showClose: true,
                message: data.msg || '您还没有当前功能的使用权限',
                type: 'error',
              });
              break;

            case -2: // 错误的请求参数
              Message({
                showClose: true,
                message: data.msg || '错误的请求参数',
                type: 'error',
              });
              break;
            case -3: // 找不到请求路径
              Message({
                showClose: true,
                message: data.msg || '找不到请求路径',
                type: 'error',
              });
              break;
            case -4: // 网络连接请求失败
              Message({
                showClose: true,
                message: data.msg || '网络连接请求失败',
                type: 'error',
              });
              break;
            case -5: // 不合法的请求方式
              Message({
                showClose: true,
                message: data.msg || '不合法的请求方式',
                type: 'error',
              });
              break;
            case -6: // 找不到方法
              Message({
                showClose: true,
                message: data.msg || '找不到方法',
                type: 'error',
              });
              break;
            case -7: // 除数为0错误
              Message({
                showClose: true,
                message: data.msg || '除数为0错误',
                type: 'error',
              });
              break;
            case -8: // 数据库异常
              Message({
                showClose: true,
                message: data.msg || '数据库异常',
                type: 'error',
              });
              break;
            case -9: // 用户未授权，ladp账号未同步
              sessionTimeOut(data);
              break;
            case 200: // 业务操作成功
            case 30000: // 系统警告，但是业务还可以继续
            default:
          }
          return data || {};
        }
        if (data.status && (data.status !== 200 && data.status !== 201)) {
          throw new Error(data.msg);
        } else if (data.code && (data.code !== 200)) {
          throw new Error(data.msg);
        }
      } else {
        throw new Error('服务器返回错误的数据格式');
      }
    } catch (error) {
      throw new Error('服务器返回错误的数据格式');
    }
  }],
});

export default {
  get(url, config = {
    params: {},
  }) {
    return ajax.get(url, config);
  },
  post(url, data = {}, config = {}) {
    return ajax.post(url, data, config);
  },
  options: ajax.defaults,
};
