<template>
  <div id="talent">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
  mounted() {
    console.log(`新域名：${process.env.VUE_APP_PORTAL}`);
  },
};
</script>
