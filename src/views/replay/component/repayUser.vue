<template>
  <dl class="replay-info">
    <dt>
      <div class="replay-title">
        <span>复盘对象:</span><em>{{ okrMain.okrMainVo.periodName }}</em
        ><em
          >({{
            dateFormat("YYYY/mm/dd", new Date(okrMain.okrMainVo.startTime)) +
            "~" +
            dateFormat("YYYY/mm/dd", new Date(okrMain.okrMainVo.endTime))
          }})</em
        >
      </div>
      <el-button plain @click="$router.back()" class="tl-btn amt-border-slip">
        返回
        <span class="lines"></span>
      </el-button>
    </dt>
    <dd class="dl-list-group">
      <dl class="dl-item user-info">
        <dd v-if="okrMain.okrMainVo.headUrl">
          <img :src="okrMain.okrMainVo.headUrl" alt />
        </dd>
        <dd v-else class="user-name">
          <em>{{ cutName(okrMain.okrMainVo.userName) }}</em>
        </dd>
        <dd>{{ okrMain.okrMainVo.userName }}</dd>
      </dl>
      <dl class="dl-item">
        <dt><span>复盘时间</span></dt>
        <dd>
          <em>{{
            okrMain.okrMainVo.reviewCommitTime
              ? okrMain.okrMainVo.reviewCommitTime
              : "--"
          }}</em>
        </dd>
      </dl>
      <dl class="dl-item" v-if="okrMain.okrMainVo.reviewStatus == 3">
        <dt><span>复盘沟通时间：</span></dt>
        <dd>
          <em>{{
            okrMain.okrMainVo.reviewCommunicateTime
              ? okrMain.okrMainVo.reviewCommunicateTime
              : "--"
          }}</em>
        </dd>
      </dl>

      <dl class="dl-item">
        <dt><span>OKR进度</span></dt>
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
    </dd>
    <dd class="flex-end">
      <em v-if="okrMain.okrMainVo.reviewType == 1">以关键结果KR复盘</em>
      <em v-if="okrMain.okrMainVo.reviewType == 0">以目标O复盘</em>
    </dd>
  </dl>
</template>
<script>
export default {
  props: ['okrMain'],
  methods: {
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
  },
};
</script>
