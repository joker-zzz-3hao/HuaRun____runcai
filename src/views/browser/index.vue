<template>
  <div class="browser-background-box">
    <div class="logo-browser"></div>
    <p>华润润才平台暂时不支持您所用的浏览器</p>
    <p>
      为了您更好的使用润才，推荐使用
      <span>Google Chrome浏览器</span
      >、<span>Firefox浏览器</span>，以获得最佳产品体验。
    </p>
  </div>
</template>

<script>

export default {
  name: 'browser',
  components: {
  },
  data() {
    return {

    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="css">
.browser-background-box {
  text-align: center;
  width: 100%;
  margin-top: 10%;
}
.logo-browser {
  background: url(~@/assets/images/logo-browser.png) no-repeat center;
  width: 368px;
  height: 196px;
  background-size: cover;
  display: block;
  margin: 0 auto;
}
.browser-background-box div,
.browser-background-box p {
  font-size: 28px;
  margin-top: 20px;
  line-height: 28px;
}
.browser-background-box p span {
  color: #6b60f1;
}
</style>