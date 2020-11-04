export default {
  data() {
    return {
      showpic: true,
    };
  },
  created() {
    if (process.env) {
      this.showpic = process.env.VUE_APP_PORTAL == 'https://talent.crcloud.com';
    }
  },
};