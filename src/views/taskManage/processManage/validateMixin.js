export default {
  methods: {
    // 字典编码校验
    validateDicCode(rule, value, callback) {
      if (!value) {
        callback('请输入编码');
      } else if (!/^\w+$/.test(value)) {
        callback('只支持数字、字母和下划线');
      } else if (this.server.queryOfPage && (this.initCode != value)) {
        this.server.queryOfPage({
          currentPage: 1,
          pageSize: 10,
          keyWord: value,
        }).then((res) => {
          if (res.code == 200 && res.data.content.length > 0) {
            callback('该编码已被使用');
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    },
    // 字典名称校验
    validateDicName(rule, value, callback) {
      if (!value) {
        callback('请输入字典名称');
      } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        callback('只支持数字、字母、汉字和下划线');
      } else if (this.server.queryOfPage && (this.initName != value)) {
        this.server.queryOfPage({
          currentPage: 1,
          pageSize: 10,
          keyWord: value,
        }).then((res) => {
          if (res.code == 200 && res.data.content.length > 0) {
            callback('该名称已被使用');
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    },
  },

};
