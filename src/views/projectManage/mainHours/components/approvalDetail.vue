<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="info.projectName"
      :close-on-click-modal="false"
    >
      <div v-for="item in info.list" :key="item.id">
        <div>
          <span>工作项:</span>
          <span>{{ item.workContent }}</span>
        </div>
        <div>
          <span>状态:</span>
          <span>{{ item.status }}%</span>
        </div>
        <div>
          <span>时间:</span>
          <span>{{ item.startDate }}至{{ item.endDate }}</span>
        </div>
        <div>
          <span>填报工时:</span>
          <span>投入{{ item.totalTime }}天</span>
        </div>
        <div>
          <span>确认工时:</span>
          <span>投入{{ item.times }}天</span>
          <span v-if="item.remark">修改原因：{{ item.remark }}</span>
        </div>
        <div>
          <span>内容:</span>
          <span>{{ item.content }}</span>
        </div>
      </div>
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
      info: {

      },
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
      this.info = data;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>