<template>
  <div class="okr-summarize">
    <tl-okr-list v-show="okrSummarizeStep == '1'"></tl-okr-list>
    <tl-okr-detail v-show="okrSummarizeStep == '2'"></tl-okr-detail>
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