<template>
  <div>
    <!-- 公共信息 -->
    <div>
      <ul>
        <li>
          <span>目标类型</span>
          <span>{{okrmain.okrBelongType}}</span>
        </li>
        <li>
          <span>负责人</span>
          <span>{{okrmain.userName}}</span>
        </li>
        <li>
          <span>更新时间</span>
          <span>{{okrmain.updateTime}}</span>
        </li>
        <li>
          <span>进度</span>
          <span>
            <el-progress :stroke-width="10" :percentage="parseInt(okrmain.okrProgress, 10)"></el-progress>
          </span>
        </li>
      </ul>
    </div>
    <okrCollapse
      :tableList="tableList"
      :canWrite="true"
      :showOKRInfoLabel="true"
      @openUndertake="openUndertake"
    ></okrCollapse>
    <undertake-table
      :departokrList="departokrList"
      :philosophyList="philosophyList"
      @selectDepart="changeDepart"
      @selectPhil="changePhil"
    ></undertake-table>
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import undertakeTable from './undertakeTable';

export default {
  name: 'changeOKR',
  data() {
    return {
      tableList: [], // okr列表
      okrmain: {}, // 公共信息
      departokrList: [], // 可关联承接的okr
      philosophyList: [], // 价值观
    };
  },
  components: {
    okrCollapse,
    'undertake-table': undertakeTable,
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
    // 选择关联的okr
    changeDepart(row) {
      this.formData.okrInfoList[this.selectObject].undertakeOkrVo.undertakeOkrDetailId = row.okrDetailId;
      this.formData.okrInfoList[this.selectObject].undertakeOkrVo.undertakeOkrVersion = row.okrDetailVersion;
    },
    // 选择关联的价值观
    changePhil(row) {
      this.formData.okrInfoList[this.selectObject].cultureId = row.id || '1162020375644299264';
      console.log('关联', row);
    },
  },
};
</script>

<style>
</style>