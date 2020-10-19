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
          <tl-process :data="item.workProgress"></tl-process>
          <span>{{ item.workProgress }}%</span>
        </div>
        <div>
          <span>时间:</span>
          <span>{{ info.startTime }}至{{ info.endTime }}</span>
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
        <span>确认工时: {{ info.timeSheet }}</span>
        <span>原因: {{ info.remark }}</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import process from '@/components/process';
import CONST from '../../const';

export default {
  name: 'approvalDetail',
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
    'tl-process': process,
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
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>