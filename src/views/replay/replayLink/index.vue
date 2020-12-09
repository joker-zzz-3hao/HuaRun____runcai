<template>
  <div class="replay-link is-padding">
    <tl-replayUser :okrMain="okrMain"></tl-replayUser>
    <tl-kr-detail
      v-if="okrMain.okrMainVo.reviewType == 1"
      @getView="getOkrReviewDetail"
      :okrMain="okrMain"
    />
    <tl-o-detail
      v-if="okrMain.okrMainVo.reviewType == 0"
      @getView="getOkrReviewDetail"
      :okrMain="okrMain"
    />
    <tl-replayHistory :activities="activities"></tl-replayHistory>
  </div>
</template>

<script>
import Server from '../server';
import krDetail from './component/krDetail';
import odetail from './component/odetail';
import replayUser from '../component/repayUser';
import replayHistory from '../component/replayHistory';

const server = new Server();
export default {
  name: 'home',
  components: {
    'tl-o-detail': odetail,
    'tl-kr-detail': krDetail,
    'tl-replayUser': replayUser,
    'tl-replayHistory': replayHistory,
  },
  data() {
    return {
      form: {},
      activeNames: ['1'],
      server,
      okrMain: {
        okrReviewPojoList: [],
        okrMainVo: {
          reviewType: 0,
        },
      },
      activities: [],
      active: {},
      communication: {},
      communicationLabel: {},
      list: [],
    };
  },
  mounted() {
    this.getOkrReviewDetail();
    this.getOkrReviewHistoryList();
  },

  methods: {
    getOkrReviewHistoryList() {
      this.server.getOkrReviewHistoryList({
        okrMainId: this.$route.query.okrId,

      }).then((res) => {
        this.activities = res.data;
      });
    },

    getOkrReviewDetail() {
      this.server.getOkrReviewDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
        this.checkDatakrs();
      });
    },
  },
};
</script>