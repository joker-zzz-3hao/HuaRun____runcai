<template>
  <div class="replay-link">
    <tl-replayUser :okrMain="okrMain"></tl-replayUser>
    <div>
      <tl-kr-detail
        v-if="okrMain.okrMainVo.reviewType == 1"
        :okrMain="okrMain"
        @getView="getOkrReviewDetail"
      />
      <tl-o-detail
        v-if="okrMain.okrMainVo.reviewType == 0"
        :okrMain="okrMain"
        @getView="getOkrReviewDetail"
      />
    </div>
    <tl-replayHistory :activities="activities"></tl-replayHistory>
  </div>
</template>

<script>
import replayUser from '../component/repayUser';
// eslint-disable-next-line import/extensions
import krDetail from './component/krDetail.vue';
// eslint-disable-next-line import/extensions
import oDetail from './component/oDetail.vue';
import replayHistory from '../component/replayHistory';
import Server from '../server';

const server = new Server();
export default {
  name: 'home',
  data() {
    return {
      reviewType: 1,
      form: {},
      activeNames: ['1'],
      server,
      okrMain: {
        okrMainVo: {},
      },
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      listBtn: [
        '超级优秀',
        '优秀',
        '继续努力',
        '要加油哦',
      ],
      activities: [],
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
        this.okrMain.okrReviewPojoList.forEach((item) => {
          item.krs.forEach((list) => {
            list.fileList = list.attachmentList;
          });
        });
        console.log(this.okrMain.okrReviewPojoList);
        this.okrMain.okrMainVo.reviewType = 1;
      });
    },

  },
};
</script>