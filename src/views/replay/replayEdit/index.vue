<template>
  <div>
    <div>复盘对象：{{ okrMain.okrMainVo.periodName }}</div>
    <div class="replay-user">
      <div class="list">姓名：{{ okrMain.okrMainVo.userName }}</div>
      <div class="list">OKR进度： {{ okrMain.okrMainVo.okrProgress }}%</div>
      <div class="list">
        复盘时间：
        {{
          okrMain.okrMainVo.reviewCommitTime
            ? okrMain.okrMainVo.reviewCommitTime
            : "--"
        }}
      </div>
    </div>
    <div>
      <el-radio-group v-model="okrMain.okrMainVo.reviewType">
        <el-radio :label="1">以关键结果KR复盘</el-radio>
        <el-radio :label="0">以目标O复盘</el-radio>
      </el-radio-group>
    </div>
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
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import krDetail from './component/krDetail.vue';
// eslint-disable-next-line import/extensions
import oDetail from './component/oDetail.vue';
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
    };
  },
  components: {
    'tl-kr-detail': krDetail,
    'tl-o-detail': oDetail,
  },
  created() {
    this.getOkrReviewDetail();
  },

  methods: {
    getOkrReviewDetail() {
      this.server.getOkrReviewDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
        if (this.okrMain.okrMainVo.reviewType == null) {
          this.okrMain.okrMainVo.reviewType = 1;
        }
      });
    },

  },
};
</script>
<style  scoped>
.replay-user {
  display: flex;
  flex-direction: row;
}
.replay-user .list {
  margin-right: 40px;
}
.right {
  float: right;
}
</style>