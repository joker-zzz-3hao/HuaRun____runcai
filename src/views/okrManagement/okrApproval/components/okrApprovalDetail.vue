<template>
  <div>
    <div>
      <span @click="backList">返回</span>
    </div>
    <div>
      <p>基本信息</p>
      <div style="display: flex;">
        <div>
          <span>姓名：</span>
          <span>陆涛</span>
        </div>
        <div>
          <span>直接审批者：</span>
          <span>张聪</span>
        </div>
        <div>
          <span>OKR周期：</span>
          <span>2020年第三季度</span>
        </div>
        <div>
          <span>OKR类型：</span>
          <span>变更</span>
        </div>
        <div>
          <span>OKR进度：</span>
          <span>12%</span>
        </div>
      </div>
    </div>
    <div>
      <p>OKR信息信息</p>
      <tl-okrCollapse :tableList="tableList" :showOKRInfoLabel="true"></tl-okrCollapse>
    </div>
    <div>
      <p>审核</p>
    </div>
    <div>
      <p>审核记录</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import Server from '../server';

const server = new Server();

export default {
  name: 'okrApprovalDetail',
  data() {
    return {
      server,
      okrId: '',
      tableList: [],
    };
  },
  components: {
    'tl-okrCollapse': okrCollapse,
  },
  props: {},
  computed: {
    activeList() {
      return Array.from(new Array(this.tableList.length).keys());
    },
  },
  mounted() {
    this.getokrDetail();
  },
  methods: {
    ...mapMutations('common', ['okrApprovalStep']),
    backList() {
      this.okrApprovalStep('1');
    },
    getokrDetail() {
      this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
        console.log('detail', res);
        this.tableList = res.data.okrDetails;
        // this.okrmain = res.data.okrMain;
        // this.voteUser = res.data.voteUser;
      });
    },
  },
  watch: {
    okrId: {
      handler() {},
      deep: true,
      immediate: true,
    },
  },
};
</script>