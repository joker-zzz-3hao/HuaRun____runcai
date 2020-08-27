import Vue from 'vue';

const $bus = new Vue();
export default {
  methods: {
    hasPower(power) {
      const userPowers = (this.$store.state.common.userInfo.privilegeList || []).map((item) => item.privilegeCode);
      if (typeof power == 'string') {
        return !!userPowers.includes(power) || userPowers.includes('admin');
      } if (Array.isArray(power)) {
        let result = true;
        if (!userPowers.includes('admin')) {
          power.forEach((item) => {
            if (!userPowers.includes(item)) {
              result = false;
            }
          });
        }
        return result;
      }
    },
    // 读取缓存
    localRead(key) {
      return localStorage.getItem(key) || '';
    },
    // 缓存
    localSave(key, value) {
      localStorage.setItem(key, value);
    },
    // 查询域名
    getOrigin() {
      const origin = window.location.origin ? window.location.origin : window.location.href.split('/#')[0];
      return origin;
    },
    // 查询链接参数
    getParams(url) {
      const keyValueArr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
      const paramObj = {};
      keyValueArr.forEach((item) => {
        const keyValue = item.split('=');
        // eslint-disable-next-line prefer-destructuring
        paramObj[keyValue[0]] = keyValue[1];
      });
      return paramObj;
    },
    // 直接下载nginx上资源
    downloadDoc(docName, locale) {
      const url = locale == 'N'
        ? `${process.env.API.VUE_APP_PORTAL}/resource/${docName}`
        : `${process.env.API.VUE_APP_PORTAL}/resource/${this.localRead('locale')}/${docName}`;
      window.open(url);
    },
    // 清除cookie
    clearCookie() {
      // eslint-disable-next-line no-useless-escape
      const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        // eslint-disable-next-line no-plusplus
        for (let i = keys.length; i--;) {
          document.cookie = `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}`; // 清除当前域名下的,例如：m.kevis.com
          document.cookie = `${keys[i]}=0;path=/;domain=${document.domain};expires=${new Date(0).toUTCString()}`; // 清除当前域名下的，例如 .m.kevis.com
          document.cookie = `${keys[i]}=0;path=/;domain=kevis.com;expires=${new Date(0).toUTCString()}`; // 清除一级域名下的或指定的，例如 .kevis.com
        }
      }
    },
    // 跳转
    go(name, config = {}, isResetScroll = false) {
      this.$router.push({
        name,
        ...config,
      });
      if (isResetScroll) {
        this.$resetScroll();
      }
    },
    // 重置滚动条 跳转时调用
    resetScroll() {
      this.$busEmit('resetScroll');
    },
    busEmit(eventName, params = {}) {
      $bus.$emit(eventName, params);
    },
    /* 用法
        let date = new Date() date不是时间格式时
         dateFormat("YYYY-mm-dd HH:MM:SS", date) */
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      // eslint-disable-next-line guard-for-in
      for (const k in opt) {
        ret = new RegExp(`(${k})`).exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
        }
      }
      return fmt;
    },
    /**
     * @author: 王益
     * @description: 简化版信息确认弹框
     * @param content: 确认内容，title：弹窗标题， obj：element组件其他配置，其中obj.callback为确定后回调
     * @return: 无
     * @example：
     * this.$simpleConfirm('恭喜你中福彩大奖500万，点击确定按钮跳转到领奖页面，确认继续？', '温馨提示', {
     *   confirmButtonText: '确定',
     *   cancelButtonText: '取消',
     *   callback() {// instance为提示弹窗实例，done为关闭弹窗实例函数引用，具体查看element文档
     *     return server.doSomething();
     *   }
     * })
     */
    $simpleConfirm(text, title, obj) {
      const {
        callback,
      } = obj;
      delete obj.callback;
      this.$confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        ...obj,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            callback(instance, done).then(() => {
              instance.confirmButtonLoading = false;
              done();
            }).catch(() => {
              instance.confirmButtonLoading = false;
            });
          } else {
            instance.confirmButtonLoading = false;
            try {
              done();
            } catch (error) {
              console.info(error);
            }
          }
        },
      });
    },
    createXmsgboxMsg(obj) {
      function createContent(content) {
        if (typeof content === 'object') {
          return `${content.map((item) => `
            <dd>${item}</dd>
          `).join('')}`;
        } if (typeof content === 'string') {
          return `<dd>${content}</dd>`;
        }
      }
      const tailMsg = `
        <dl class="dialog-title">
          <dt>${obj.title}</dt>
          ${createContent(obj.content)}
        </dl>
      `;
      obj.title = ''; // 删除弹框自带的title,保留关闭按钮
      return `
          <div class="tip-icon"><i></i></div>
          ${tailMsg}
        `;
    },
    $xmsgbox(obj) {
      const {
        callback,
        cancelCallback,
        refuseCallback,
      } = obj;
      delete obj.callback;
      delete obj.cancelCallback;
      delete obj.refuseCallback;
      return this.$msgbox({
        message: this.createXmsgboxMsg(obj),
        showClose: false,
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (typeof callback == 'function') {
              instance.confirmButtonLoading = true;
              callback(instance, done).then(() => {
                instance.confirmButtonLoading = false;
                done();
              }).catch(() => {
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
            }
          } else if (action === 'cancel' && !cancelCallback) {
            if (typeof refuseCallback == 'function') {
              instance.cancelButtonLoading = true;
              refuseCallback(instance, done).then(() => {
                instance.cancelButtonLoading = false;
                done();
              }).catch(() => {
                instance.cancelButtonLoading = false;
              });
            } else {
              done();
            }
          } else {
            instance.confirmButtonLoading = false;
            try {
              if (typeof cancelCallback == 'function') {
                cancelCallback();
              }
              done();
            } catch (error) {
              console.info(error);
            }
          }
        },
        ...obj,
      });
    },

    $xconfirm(obj) {
      obj.msgType = 'confirm';
      obj.showConfirmButton = true;
      obj.showCancelButton = obj.showCancelButton !== false;
      obj.customClass = 'confirm has-close-icon';
      return this.$xmsgbox(obj);
    },
    $xwarning(obj) {
      obj.msgType = 'warning';
      obj.customClass = 'warning';
      obj.showConfirmButton = true;
      return this.$xmsgbox(obj);
    },
    $xsuccess(obj) {
      obj.msgType = 'success';
      obj.customClass = 'success';
      return this.$xmsgbox(obj);
    },
    $xerror(obj) {
      obj.msgType = 'error';
      obj.customClass = 'error';
      return this.$xmsgbox(obj);
    },
    $xwaiting(obj) {
      obj.msgType = 'waiting';
      obj.customClass = 'waiting';
      return this.$xmsgbox(obj);
    },
  },
};