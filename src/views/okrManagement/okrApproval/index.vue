<template>
  <div>
    <tl-okrApprovalList v-if="okrApprovalStep == '1'"></tl-okrApprovalList>
    <tl-okrApprovalDetail v-if="okrApprovalStep == '2'"></tl-okrApprovalDetail>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
  mounted() {},
  methods: {},
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>