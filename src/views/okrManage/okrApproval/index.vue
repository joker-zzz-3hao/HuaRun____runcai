<template>
  <div class="okr-approval">
    <tl-okrApprovalList v-show="okrApprovalStep == '1'"></tl-okrApprovalList>
    <tl-okrApprovalDetail v-show="okrApprovalStep == '2'"></tl-okrApprovalDetail>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrApprovalList from './components/okrApprovalList';
import okrApprovalDetail from './components/okrApprovalDetail';

export default {
  name: 'okrApproval',
  data() {
    return {
    };
  },
  components: {
    'tl-okrApprovalList': okrApprovalList,
    'tl-okrApprovalDetail': okrApprovalDetail,
  },
  props: {},
  computed: {
    ...mapState('common', {
      okrApprovalStep: (state) => state.okrApprovalStep,
    }),
  },
  created() {},
  mounted() {
    this.setOkrApprovalStep('1');
  },
  methods: {
    ...mapMutations('common', ['setOkrApprovalStep']),
  },
  watch: {},
};
</script>