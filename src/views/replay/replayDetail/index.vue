<template>
  <div>
    <div>
      复盘对象：{{ okrMain.okrMainVo.periodName }}({{
        dateFormat("YYYY/mm/dd", new Date(okrMain.okrMainVo.startTime)) +
        "~" +
        dateFormat("YYYY/mm/dd", new Date(okrMain.okrMainVo.endTime))
      }})
    </div>
    <div class="replay-user">
      <div class="list">
        <img
          style="width: 50px; height: 50px; border-radius: 50%"
          :src="okrMain.okrMainVo.headUrl"
          alt=""
          srcset=""
        />{{ okrMain.okrMainVo.userName }}
      </div>
      <div class="list">
        <dl class="okr-progress">
          <dt>
            <em>OKR进度</em>
          </dt>
          <dd>
            <el-progress
              type="circle"
              :percentage="parseInt(okrMain.okrMainVo.okrProgress, 10) || 0"
              :width="70"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
          </dd>
        </dl>
      </div>
      <div class="list">
        复盘时间：
        {{
          okrMain.okrMainVo.reviewCommitTime
            ? okrMain.okrMainVo.reviewCommitTime
            : "--"
        }}
      </div>
      <div class="list" v-if="okrMain.okrMainVo.reviewStatus == 3">
        复盘沟通时间：
        {{
          okrMain.okrMainVo.reviewCommunicateTime
            ? okrMain.okrMainVo.reviewCommunicateTime
            : "--"
        }}
      </div>
    </div>
    <div>
      <el-radio-group v-model="okrMain.okrMainVo.reviewType">
        <el-radio :label="1" v-if="okrMain.okrMainVo.reviewType == 1"
          >以关键结果KR复盘</el-radio
        >
        <el-radio :label="0" v-if="okrMain.okrMainVo.reviewType == 0"
          >以目标O复盘</el-radio
        >
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
    <div>
      <div>复盘记录</div>
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(item, index) in activities"
          :key="index"
          :timestamp="item.createTime"
          >{{ item.userName }} {{ item.content }}</el-timeline-item
        >
      </el-timeline>
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
  },
  created() {
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