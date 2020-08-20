<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="132px"
      :label-position="labelPosition"
      class="tl-form"
    >
      <el-form-item label="OKR周期名称" prop="periodName">
        <el-input
          v-model="form.periodName"
          maxlength="64"
          placeholder="请输入OKR周期名称"
          class="tl-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="周期开始日期" prop="startTime">
        <el-date-picker
          type="date"
          v-model="form.startTime"
          maxlength="64"
          placeholder="请设置开始日期"
          class="tl-date-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="周期结束日期" prop="endTime">
        <el-date-picker
          type="date"
          v-model="form.endTime"
          placeholder="请设置结束日期"
          class="tl-date-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="设置为默认周期" prop="checkStatus">
        <el-radio-group v-model="form.checkStatus" class="tl-radio-group">
          <el-radio label="1" class="tl-radio">是</el-radio>
          <el-radio label="0" class="tl-radio">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="OKR周期状态" prop="periodType">
        <el-radio-group v-model="form.periodType" class="tl-radio-group">
          <el-radio label="1" class="tl-radio">开启</el-radio>
          <el-radio label="0" class="tl-radio">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip">确定</el-button>
      <el-button plain @click="close()" class="tl-btn amt-border-slip">
        取消
        <span class="lines"></span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'addOkrCycle',
  props: {
    title: {
      type: String,
      required: true,
    },
    updateData: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      rules: {
        periodName: [
          { required: true, message: '请输入OKR周期名称', trigger: 'blur' },
        ],
        startTime: [
          { required: true, message: '请设置开始日期', trigger: 'change' },
        ],
        endTime: [
          { required: true, message: '请设置结束日期', trigger: 'change' },
        ],
        checkStatus: [
          { required: true, message: '设置为默认周期', trigger: 'change' },
        ],
        periodType: [
          { required: true, message: 'OKR周期状态', trigger: 'change' },
        ],
      },
      form: {
        periodName: '',
        startTime: '',
        endTime: '',
        checkStatus: '',
        periodType: '',
        periodDesc: '',
      },
      server,
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      labelPosition: 'left',
    };
  },

  mounted() {
    this.dialogTableVisible = true;
    if (this.updateData) {
      this.form = this.updateData;
    }
  },
  methods: {
    addOrUpdate() {
      this.server.addOrUpdate(this.form).then((res) => {
        if (res.code == 200) {
          this.$emit('getTableList');
          this.$message.success(res.msg);
          this.closed();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.addOrUpdate();
        } else {
          return false;
        }
      });
    },
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
    },
    closeshowMember() {
      this.dialogVisible = false;
    },
  },
};
</script>