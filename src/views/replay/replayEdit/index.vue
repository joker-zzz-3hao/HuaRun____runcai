<template>
  <div>
    <el-button plain @click="$router.back()" class="tl-btn amt-border-slip">
      返回
      <span class="lines"></span>
    </el-button>
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
          v-if="okrMain.okrMainVo.headUrl"
          style="width: 50px; height: 50px; border-radius: 50%"
          :src="okrMain.okrMainVo.headUrl"
        />
        <div class="user-name" v-else>
          <em>{{ cutName(okrMain.okrMainVo.userName) }}</em>
        </div>
        {{ okrMain.okrMainVo.userName }}
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
        @getView="getOkrReviewDetail"
      />
      <tl-o-detail
        v-if="okrMain.okrMainVo.reviewType == 0"
        :okrMain="okrMain"
        @getView="getOkrReviewDetail"
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
  mounted() {
    this.getOkrReviewDetail();
  },

  methods: {
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
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