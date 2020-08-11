<template>
  <div>
    <okrCollapse :tableList="tableList" :canWrite="true" :showOKRInfoLabel="true"></okrCollapse>
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';

export default {
  name: 'changeOKR',
  data() {
    return {
      tableList: [], // okr列表

    };
  },
  components: {
    okrCollapse,
  },
  props: {
    server: {
      type: Object,
      required: true,
    },
    canWrite: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.getokrDetail();
  },
  methods: {
    // 查okr详情
    getokrDetail() {
      this.server.getokrDetail({ okrId: '888811113333' }).then((res) => {
        console.log('detail', res);
        this.tableList = res.data.okrDetails;
        this.okrmain = res.data.okrMain;
        // this.voteUser = res.data.voteUser;
      });
    },
  },
};
</script>

<style>
</style>