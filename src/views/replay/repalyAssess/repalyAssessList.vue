<template>
  <div class="replay-list">
     <dl class="dl-item">
        <dt>周期</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="用户类型"
            :popper-append-to-body="false"
            @change="okrReviewList"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>

    <div class="cont-area"></div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'repalyAssessList',
  data() {
    return {
      periodIdList: [],
      periodId: '',
      server,
    };
  },
  mounted() {
    this.getOkrCycleList();
  },
  methods: {
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;

        this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
      });
    },
  },
};
</script>

<style>
</style>