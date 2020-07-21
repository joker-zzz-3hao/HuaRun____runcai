export default {
  data() {
    return {};
  },
  methods: {
    validateNickName(rule, value, callback) {
      if (!value) {
        callback('请输入昵称');
      } else {
        callback();
      }
    },
  }
}