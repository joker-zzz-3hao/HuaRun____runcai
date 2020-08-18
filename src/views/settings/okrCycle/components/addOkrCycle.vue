<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="OKR周期名称" prop="periodName">
        <el-input
          style="width:320px"
          v-model="form.periodName"
          maxlength="64"
          placeholder="请输入OKR周期名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="周期开始日期" prop="startTime">
        <el-date-picker type="date" v-model="form.startTime" maxlength="64" placeholder="请设置开始日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="周期结束日期" prop="endTime">
        <el-date-picker type="date" v-model="form.endTime" placeholder="请设置结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="设置为默认周期" prop="checkStatus">
        <el-radio-group v-model="form.checkStatus">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="OKR周期状态" prop="periodType">
        <el-radio-group v-model="form.periodType">
          <el-radio label="1">开启</el-radio>
          <el-radio label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm()">确定</el-button>
      <el-button @click="close()">取 消</el-button>
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
<style  scoped>
.addRoule {
  position: relative;
}
.roulemember {
  width: 100%;
  z-index: 99999999;
  position: absolute;
  left: 0;
  top: 50px;
  padding: 25px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>