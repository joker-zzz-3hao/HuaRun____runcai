<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'replay',
  components: {
  },
  destroyed() {
    sessionStorage.removeItem('historyPer');
  },
};
</script>