import Vue from 'vue';

const $bus = new Vue();
export default {
  methods: {
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
  },
};