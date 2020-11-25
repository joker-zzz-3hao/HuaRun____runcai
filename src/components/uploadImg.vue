<template>
  <div>
    <el-upload
      class="avatar-uploader"
      v-bind="$attrs"
      v-on="$listeners"
      :action="action"
      :show-file-list="false"
      accept="image/jpeg, image/jpg, image/png, image/bmp"
      :on-success="imgUploadSuccess"
      :before-upload="beforeUpload"
      :headers="headers"
      :data="dataParams"
    >
      <img v-if="!!action" :src="fileList" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import BMF from 'browser-md5-file';
import md5 from 'blueimp-md5';

const bmf = new BMF();

export default {
  name: 'imgUpload',
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    files: {
      type: Array,
      default: () => [],
    },
    actionName: {
      type: String,
      default: '',
    },
    imgWidth: {
      type: Number,
      default: 1000,
    },
    imgHeight: {
      type: Number,
      default: 500,
    },
    isUploadHead: {
      type: Boolean,
      default: false,
    },
    sourceKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      dataParams: {},
    };
  },
  created() {
    this.dataParams = {
      sourceType: 'USER_HEAD', sourceKey: this.sourceKey, validateCode: '', ...this.params,
    };
  },
  computed: {
    action() {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      return `${origin}/gateway/system-service/sys/attachment/upload`;
    },
    headers() {
      return { token: localStorage.token };
    },
    fileList() {
      return this.files[0].url;
    },
  },
  methods: {
    doMd5(file) {
      const self = this;
      return new Promise((resolve, reject) => {
        let fileMd5 = '';
        let fileNameMd5 = '';
        return bmf.md5(
          file,
          (err, md5Code) => {
            if (err) {
              reject();
            } else {
              fileMd5 = md5Code;
              fileNameMd5 = md5(file.name);
              self.dataParams.validateCode = md5(fileMd5.substr(0, 6) + fileNameMd5.substr(0, 6));
              resolve();
            }
          },
        );
      });
    },
    beforeUpload(file) {
      const self = this;
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
      const isPNG = file.type === 'image/png';
      const isNameLength = file.name && file.name.length < 100;
      let maxLength = file.size / 1024 / 1024 < 5;
      if (this.isUploadHead) {
        maxLength = file.size / 1024 / 1024 < 2;
      }

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG、PNG格式');
        return false;
      }
      if (!maxLength) {
        this.$message.error(
          `上传图片大小不能超过 ${this.isUploadHead ? 2 : 5}MB`,
        );
        return false;
      }
      if (!isNameLength) {
        this.$message.error('上传图片文件名长度最多为99个字符');
        return false;
      }

      const isSize = new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        // if (true) {
        // 是否判断宽高
        /* eslint func-names:off */
        img.onload = function () {
          const valid = img.width > self.imgWidth && img.height > self.imgHeight;
          if (valid) {
            resolve();
          } else {
            reject();
          }
        };
        img.src = url;
      }).then(
        () => true,
        () => {
          this.$message.error(
            `图片宽高不能小于${this.imgWidth}px * ${
              this.imgHeight
            }px`,
          );
          return Promise.reject();
        },
      );
      const md5Valid = self.doMd5(file);
      return Promise.all([isSize, md5Valid]);
    },
    imgUploadSuccess(response) {
      if (response.code == 200) {
        this.$emit('change', response.data);
      }
    },
  },
};
</script>