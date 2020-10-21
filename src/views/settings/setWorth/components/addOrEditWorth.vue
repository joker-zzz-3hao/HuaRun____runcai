<template>
  <el-dialog
    :modal-append-to-body="false"
    @closed="closed"
    @close="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="tl-form"
    >
      <el-form-item label="公司价值观" prop="cultureName">
        <el-input
          maxlength="50"
          v-model.trim="form.cultureName"
          placeholder="请输入公司价值观"
          class="tl-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="价值观详情" prop="cultureDesc">
        <el-input
          maxlength="1000"
          v-model.trim="form.cultureDesc"
          placeholder="请输入价值观详情"
          class="tl-input"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="submitForm"
        class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button
        :disabled="loading"
        plain
        @click="closed"
        class="tl-btn amt-border-fadeout"
        >取 消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'addOrEditWorth',
  props: {},
  data() {
    return {
      server,
      loading: false,
      dialogTableVisible: false,
      isEdit: false,
      title: '创建价值观',
      form: {
        cultureDesc: '',
        cultureName: '',
        id: '',
      },
      rules: {
        cultureName: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
        ],
        cultureDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
    };
  },

  mounted() {},
  methods: {
    show(type, data) {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      if (type == '1') {
        this.isEdit = true;
        this.title = '编辑价值观';
        this.form.cultureDesc = data.cultureDesc;
        this.form.cultureName = data.cultureName;
        this.form.id = data.id;
      }
      this.dialogTableVisible = true;
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            cultureDesc: this.form.cultureDesc,
            cultureName: this.form.cultureName,
          };
          let url = 'addCulture';
          if (this.isEdit) {
            url = 'updateCulture';
            params.id = this.form.id;
          }
          this.loading = true;
          this.server[url](params).then((res) => {
            this.loading = false;

            if (res.code == '200') {
              this.$emit('success');
              this.dialogTableVisible = false;
            }
          });
        }
      });
    },
    closed() {
      this.dialogTableVisible = false;
    },
  },
};
</script>