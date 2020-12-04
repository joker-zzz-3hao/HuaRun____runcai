<template>
  <el-dialog
    :append-to-body="true"
    :before-close="close"
    @closed="close"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible"
    class="tl-dialog set-period"
    width="400px"
    title="偏好设置"
  >
    <dl>
      <dt>为了方便您查看全局OKR，请先选择您希望看到的OKR周期。</dt>
      <dd>选择确认后系统将记住您的选项</dd>
    </dl>
    <el-scrollbar>
      <el-radio-group v-model="periodId">
        <el-radio
          class="tl-radio"
          v-for="item in periodList"
          :label="item.periodId"
          :key="item.periodId"
        >
          <span>{{ item.periodName }}</span>
          <em v-if="item.existOkrData">----------有数据</em>
        </el-radio>
      </el-radio-group>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summit"
        :loading="loading"
        :disabled="loading"
        >确定</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'mission',
  data() {
    return {
      server,
      dialogTableVisible: false,
      periodList: [],
      periodId: '',
      loading: false,
    };
  },
  methods: {
    show(periodId, periodList) {
      this.periodList = periodList;
      this.periodId = periodId;
      this.dialogTableVisible = true;
    },
    close() {
      // 清空选项
      this.dialogTableVisible = false;
    },
    summit() {
      if (this.periodId) {
        this.loading = true;
        this.server.setOkrMapPeriodId({ periodId: this.periodId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('设置成功');
            this.close();
            this.$emit('success');
          }
          this.$nextTick(() => { this.loading = false; }, 3000);
        });
      } else {
        this.$message.error('请选择一个周期');
      }
    },
  },
};
</script>

<style>
</style>