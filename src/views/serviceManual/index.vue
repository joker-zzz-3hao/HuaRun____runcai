<template>
  <div class="teams-manage">
    <div class="operating-area">
      <div class="page-title">使用手册</div>
    </div>
    <div class="cont-area">
      <dl class="dl-card-panel">
        <dd @click="open">1、快快快.pdf</dd>
        <dd>2、乐乐乐乐.pdf</dd>
        <dd>3、开开.pdf</dd>
        <dd>4、心心.pdf</dd>
      </dl>
    </div>
  </div>
</template>

<script>

import Server from './server';

const server = new Server();

export default {
  name: 'teamsManage',
  data() {
    return {
      server,

    };
  },
  components: {

  },
  computed: {

  },
  mounted() {

  },
  methods: {
    open() {
      const origin = window.location.origin ? window.location.origin : window.location.href.split(
        '/#',
      )[0];
      if (['http://localhost:8080', 'https://cr-talent-dev.crcloud.com'].includes(origin)) {
        window.open('https://cr-talent-dev.crcloud.com/help/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C%E7%BB%88%E6%9E%81%E7%89%88v1.3.0.pdf');
      } else if (origin == 'https://cr-talent-uat.crcloud.com') {
        window.open('https://cr-talent-dev.crcloud.com/help/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C%E7%BB%88%E6%9E%81%E7%89%88v1.3.0.pdf');
      } else if (origin == 'https://talent.crcloud.com') {
        window.open();
      }
    },
  },
  watch: {

  },
};
</script>