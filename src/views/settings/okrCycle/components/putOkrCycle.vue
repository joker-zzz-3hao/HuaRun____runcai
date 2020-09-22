<template>
  <el-drawer
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    :modal="false"
    class="tl-drawer"
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
      <el-form-item label="起草开始时间" prop="draftingStartTime">
        <el-date-picker
          type="date"
          v-model="form.draftingStartTime"
          placeholder="请设置起草开始时间"
          popper-class="tl-date-popper"
          class="tl-date-editor"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审批结束时间" prop="approvalEndTime">
        <el-date-picker
          type="date"
          v-model="form.approvalEndTime"
          placeholder="请设置审批结束时间"
          popper-class="tl-date-popper"
          value-format="yyyy-MM-dd"
          class="tl-date-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="周期开始日期" prop="startTime">
        <el-date-picker
          v-model="dateTime"
          @change="getTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="请设置开始日期"
          end-placeholder="请设置结束日期"
          popper-class="tl-range-popper"
          class="tl-range-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="自评举证时间" prop="selfAssessReminderTime">
        <el-date-picker
          type="date"
          v-model="form.selfAssessReminderTime"
          placeholder="请设置自评举证时间"
          popper-class="tl-date-popper"
          value-format="yyyy-MM-dd"
          class="tl-date-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="设置为默认周期" prop="checkStatus">
        <el-radio-group v-model="form.checkStatus" class="tl-radio-group">
          <el-radio label="1" class="tl-radio">是</el-radio>
          <el-radio label="0" class="tl-radio">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="operating-box">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip">保存</el-button>
      <el-button plain @click="close" class="tl-btn amt-border-fadeout">取消</el-button>
    </div>
  </el-drawer>
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
        approvalEndTime: [
          { required: true, message: '请设置结束时间', trigger: 'change' },
        ],
        draftingStartTime: [
          { required: true, message: '请设置起草开始时间', trigger: 'change' },
        ],
        checkStatus: [
          { required: true, message: '设置为默认周期', trigger: 'change' },
        ],
        periodType: [
          { required: true, message: 'OKR周期状态', trigger: 'change' },
        ],
        selfAssessReminderTime: [
          { required: true, message: '请设置自评举证时间', trigger: 'change' },
        ],
        dateTime: [
          { required: true, message: '请设置周期开始日期', trigger: 'change' },
        ],
      },
      form: {
        periodName: '',
        startTime: '',
        endTime: '',
        checkStatus: '',
        periodType: '',
        periodDesc: '',
        selfAssessReminderTime: '',
        approvalEndTime: '',
        draftingStartTime: '',
      },
      server,
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      labelPosition: 'left',
      dateTime: '',
    };
  },

  mounted() {
    this.dialogTableVisible = true;
    console.log(this.updateData);
    this.form = this.updateData;
    this.dateTime = [this.updateData.startTime, this.updateData.endTime];
  },
  methods: {
    getTime(date) {
      console.log(date);
      // eslint-disable-next-line prefer-destructuring
      this.form.startTime = date[0];
      // eslint-disable-next-line prefer-destructuring
      this.form.endTime = date[1];
    },
    addOrUpdate() {
      const { form } = this;
      form.startTime = new Date(this.form.startTime);
      form.selfAssessReminderTime = new Date(this.form.selfAssessReminderTime);
      form.endTime = new Date(this.form.endTime);
      form.approvalEndTime = new Date(this.form.approvalEndTime);
      form.draftingStartTime = new Date(this.form.draftingStartTime);
      this.server.addOrUpdate(form).then((res) => {
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