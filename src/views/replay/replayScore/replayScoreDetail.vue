<template>
  <div class="replay-link is-padding">
    <tl-replayUser :okrMain="okrMain"></tl-replayUser>
    <tl-kr-detail @getView="getOkrReviewDetail" :okrMain="okrMain" />
  </div>
</template>

<script>
import Server from '../server';
import krDetail from './component/krDetail';
import replayUser from './component/repayUser';

const server = new Server();

export default {
  name: 'replayScoreDetail',
  components: {
    'tl-kr-detail': krDetail,
    'tl-replayUser': replayUser,

  },
  data() {
    return {
      server,
      tableData: [],
      pageSize: 20,
      totalpage: 0,
      currentPage: 1,
      okrMain: {},
    };
  },
  mounted() {
    this.getOkrReviewDetail();
  },
  methods: {
    getOkrReviewDetail() {
      this.server.getOkrCheckDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
      });
    },
  },
};
</script>

<style>
</style>