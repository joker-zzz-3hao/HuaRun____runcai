<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :close-on-click-modal="false"
    custom-class="approval"
    class="tl-dialog"
    width="620px"
  >
  <div>工作项:{{info.workContent}} </div>

    <div>工作内容:{{info.workDesc}}</div>
      <div>进度:{{info.workProgress + '%'}}</div>
        <div>填报工时:{{day+'天'}}({{textDay}})</div>
        <div>工时日期:{{week}}</div>
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
