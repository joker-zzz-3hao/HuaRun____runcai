<template>
  <div class="replay-link">
    <tl-replayUser :okrMain="okrMain"></tl-replayUser>
    <div>
      <tl-kr-detail
        v-if="okrMain.okrMainVo.reviewType == 1"
        :okrMain="okrMain"
      />
      <tl-o-detail
        v-if="okrMain.okrMainVo.reviewType == 0"
        :okrMain="okrMain"
      />
    </div>
    <tl-replayHistory :activities="activities"></tl-replayHistory>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import krDetail from './component/krDetail.vue';
// eslint-disable-next-line import/extensions
import oDetail from './component/oDetail.vue';
import Server from '../server';
import replayUser from '../component/repayUser';
import replayHistory from '../component/replayHistory';

const server = new Server();
export default {
  name: 'home',
  data() {
    return {
      form: {},
      server,
      activeNames: ['1'],
      activities: [],
      okrMain: {
        okrMainVo: {},
      },
    };
  },
  components: {
    'tl-kr-detail': krDetail,
    'tl-o-detail': oDetail,
    'tl-replayUser': replayUser,
    'tl-replayHistory': replayHistory,
  },
  mounted() {
    this.getOkrReviewDetail();
    this.getOkrReviewHistoryList();
  },
  methods: {
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
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
      });
    },

  },
};
</script>