<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="info.projectNameCn"
      :close-on-click-modal="false"
    >
      <div v-for="item in info.weeklyItemList" :key="item.id">
        <div>
          <span>工作项:</span>
          <span>{{ item.workContent }}</span>
        </div>
        <div>
          <span>进度:</span>
          <span>{{ item.workProgress }}%</span>
        </div>
        <div>
          <span>时间:</span>
          <span>{{ item.startTime }}至{{ item.endTime }}</span>
        </div>
        <div>
          <span>填报工时:</span>
          <span>投入{{ item.workTime }}天</span>
        </div>
        <div>
          <span>内容:</span>
          <span>{{ item.workDesc }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span>确认工时</span>
        <el-input-number
          v-model="timeSheet"
          :precision="1"
          :step="0.5"
          :min="0"
        ></el-input-number>
        <span>原因</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="remark"
        >
        </el-input>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="approval">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CONST from '../../const';

export default {
  name: 'approval',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      timeSheet: 0,
      info: {},
      remark: '',
    };
  },
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {
    show(data) {
      this.server.approvalTimeSheetList({
        projectApprovalId: data.projectApprovalId,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.info = res.data;
          this.timeSheet = this.info.timeSheet;
        }
      });
      this.visible = true;
    },
    approval() {
      this.server.approvaledTimeSheetList({
        projectId: this.info.projectId,
        timeSheet: this.timeSheet,
        remark: this.remark,
        sourceId: this.info.sourceId,
        sourceType: this.info.sourceType,
        projectApprovalId: this.info.projectApprovalId,
      }).then((res) => {
        if (res.code == '200') {
          this.$emit('success');
          this.close();
        }
      });
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>