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
      <p>基本OKR信息信息</p>
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

export default {
  name: 'okrApprovalDetail',
  data() {
    return {
    };
  },
  components: {},
  props: {},
  computed: {},
  mounted() {},
  methods: {
    ...mapMutations('common', ['okrApprovalStep']),
    backList() {
      this.okrApprovalStep('1');
    },
  },
  watch: {},
};
</script>