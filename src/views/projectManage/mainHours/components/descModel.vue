<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :title="drawerTitle"
    :close-on-click-modal="false"
    custom-class="approval-list-detail"
    class="tl-dialog"
    width="820px"
  >
    <div class="dl-group">
      <dl>
        <dt><span>工作项</span></dt>
        <dd>
          <em>{{ info.workContent }}</em>
        </dd>
      </dl>
      <dl>
        <dt><span>工作内容</span></dt>
        <dd>
          <em>{{ info.workDesc }}</em>
        </dd>
      </dl>
      <dl>
        <dt><span>工作进度</span></dt>
        <dd>
          <em>{{ info.workProgress + "%" }}</em>
        </dd>
      </dl>
      <dl>
        <dt><span>填报工时</span></dt>
        <dd>
          <em>{{ day + "天" }}({{ textDay }})</em>
        </dd>
      </dl>
      <dl>
        <dt><span>工时日期</span></dt>
        <dd>
          <em>{{ week }}</em>
        </dd>
      </dl>
    </div>

    <!-- <div>工作项:</div>

    <div>工作内容:</div>
    <div>工作进度:</div>
    <div>填报工时:</div>
    <div>工时日期:</div> -->
  </el-dialog>
</template>

<script>
// import process from '@/components/process';
import CONST from '../../const';

export default {
  name: 'approval',
  data() {
    return {
      CONST,
      visible: false,
      popoverVisible: false,
      loading: false,
      timeSheet: 0.5,
      confirmSheet: 0.5,
      info: {},
      remark: '',
      editRemark: '',
      textDay: '',
      day: '',
      week: '',
      drawerTitle: '工时详情',
    };
  },
  // components: {
  //   'tl-process': process,
  // },
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
    show(row, day, textDay, week) {
      this.info = row;
      this.day = day;
      this.textDay = textDay;
      this.week = week;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>
