<!--
  功能：
  作者：王志任
  时间：2020年10月30日 14:28:46
  备注：
-->
<template>
  <div>
    <tl-okr-list v-if="okrSummarizeStep == '1'"></tl-okr-list>
    <tl-okr-detail v-if="okrSummarizeStep == '2'"></tl-okr-detail>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrDetail from './components/okrDetail';
import okrList from './components/okrList';

export default {
  name: '',
  components: {
    'tl-okr-list': okrList,
    'tl-okr-detail': okrDetail,
  },
  props: {},
  data() {
    return {
    };
  },
  created() {},
  mounted() {
    this.setOkrSummarizeStep('1');
  },
  computed: {
    ...mapState('common', {
      okrSummarizeStep: (state) => state.okrSummarizeStep,
    }),
  },
  methods: {
    ...mapMutations('common', ['setOkrSummarizeStep']),
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>