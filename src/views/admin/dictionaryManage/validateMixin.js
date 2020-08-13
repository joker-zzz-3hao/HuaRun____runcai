export default {
  methods: {
    // 字典编码校验
    validateDicCode(rule, value, callback) {
      if (!value) {
        callback('请输入编码');
      } else if (!/^[_0-9a-zA-Z]{3,}$/.test(value)) {
        callback('只支持数字、字母');
      } else if (this.server.queryOfPage) {
        this.server.queryOfPage({
          currentPage: 1,
          pageSize: 10,
          keyWord: value,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.content.length > 0) {
              callback('该编码已被使用');
            }
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
        callback('请输入编码');
      } else if (!/^[_0-9a-zA-Z]{3,}$/.test(value)) {
        callback('只支持数字、字母');
      } else if (this.server.queryOfPage) {
        this.server.queryOfPage({
          currentPage: 1,
          pageSize: 10,
          keyWord: value,
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.content.length > 0) {
              callback('该编码已被使用');
            }
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
