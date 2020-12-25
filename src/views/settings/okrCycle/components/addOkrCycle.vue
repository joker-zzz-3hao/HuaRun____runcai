<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogTableVisible"
    @click.native="closeshowMember"
    :before-close="close"
    @closed="closed"
    :append-to-body="true"
    :close-on-click-modal="false"
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
      <el-form-item label="起草开始时间" prop="draftingStartTime">
        <el-date-picker
          type="date"
          v-model="form.draftingStartTime"
          @change="draftingTime"
          value-format="yyyy-MM-dd"
          placeholder="请设置起草开始时间"
          popper-class="tl-date-popper"
          class="tl-date-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="周期起始日期" prop="startTime">
        <el-date-picker
          v-model="dateTime"
          @change="getTime"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="请设置开始日期"
          end-placeholder="请设置结束日期"
          popper-class="tl-range-popper"
          class="tl-range-editor"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审批结束时间" prop="approvalEndTime">
        <el-date-picker
          type="date"
          v-model="form.approvalEndTime"
          @change="approvalTime"
          placeholder="请设置审批结束时间"
          popper-class="tl-date-popper"
          value-format="yyyy-MM-dd"
          class="tl-date-editor"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="自评举证时间" prop="selfAssessReminderTime">
        <el-date-picker
          type="date"
          v-model="form.selfAssessReminderTime"
          value-format="yyyy-MM-dd"
          @change="selfAssessTime"
          placeholder="请设置自评举证时间"
          popper-class="tl-date-popper"
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button plain @click="close" class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
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
        dateTime: [
          { required: true, message: '请设置日期', trigger: 'change' },
        ],
        draftingStartTime: [
          { required: true, message: '请设置起草开始时间', trigger: 'change' },
        ],
        approvalEndTime: [
          { required: true, message: '请设置结束时间', trigger: 'change' },
        ],
        selfAssessReminderTime: [
          { required: true, message: '请设置自评举证时间', trigger: 'change' },
        ],
        checkStatus: [
          { required: true, message: '设置为默认周期', trigger: 'change' },
        ],
        periodType: [
          { required: true, message: 'OKR周期状态', trigger: 'change' },
        ],
        startTime: [
          { required: true, message: '请设置周期日期', trigger: 'change' },
        ],
      },
      form: {
        periodName: '',
        startTime: '',
        endTime: '',
        checkStatus: '',
        periodType: '',
        periodDesc: '',
        draftingStartTime: '',
        approvalEndTime: '',
        selfAssessReminderTime: '',
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
  },
  methods: {
    draftingTime(date) {
      const tingTime = new Date(date).getTime();
      const startTime = new Date(this.form.startTime).getTime();
      if (this.form.startTime) {
        if (tingTime > startTime - 24 * 60 * 60 * 1000) {
          this.$message.error('起草时间不能大于周期开始时间');
          this.form.draftingStartTime = '';
          return false;
        }
      }
    },
    approvalTime(date) {
      const approvalTime = new Date(date).getTime();
      const startTime = new Date(this.form.startTime).getTime();
      const endTime = new Date(this.form.endTime).getTime();
      if (startTime > approvalTime || approvalTime > endTime) {
        this.$message.error('请设置在周期起始时间范围内');
        this.form.approvalEndTime = '';
      }
    },
    selfAssessTime(date) {
      const selfAssessTime = new Date(date).getTime();
      const endTime = new Date(this.form.endTime).getTime();
      if (selfAssessTime < endTime + 24 * 60 * 60 * 1000) {
        this.$message.error('自评举证时间请大于周期结束时间');
        this.form.selfAssessReminderTime = '';
      }
    },
    getTime(date) {
      const draftingStartTime = new Date(this.form.draftingStartTime).getTime();
      const selfAssessReminderTime = new Date(this.form.selfAssessReminderTime).getTime();
      const startTime = new Date(date[0]).getTime();
      const endTime = new Date(date[1]).getTime();

      if (draftingStartTime + 24 * 60 * 60 * 1000 > startTime) {
        this.$message.error('起草时间不能大于周期开始时间');
        this.dateTime = '';
        return false;
      }
      if (selfAssessReminderTime < endTime + 24 * 60 * 60 * 1000) {
        this.$message.error('周期结束时间不能大于自评举证时间');
        this.dateTime = '';
        return false;
      }
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