<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'demoIndex',
  components: {
  },
  mounted() {
    console.log(this.$router);
  },
};
</script>