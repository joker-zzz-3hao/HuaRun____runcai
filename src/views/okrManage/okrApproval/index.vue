<template>
  <div class="okr-approval">
    <tl-okrApprovalList
      v-show="okrApprovalStep == '1'"
      :canApproval="canApproval"
    ></tl-okrApprovalList>
    <tl-okrApprovalDetail
      v-show="okrApprovalStep == '2'"
      :canApproval="canApproval"
    ></tl-okrApprovalDetail>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrApprovalList from './components/okrApprovalList';
import okrApprovalDetail from './components/okrApprovalDetail';
import Server from './server';

const server = new Server();

export default {
  name: 'okrApproval',
  data() {
    return {
      server,
      canApproval: true,
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
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  created() {},
  mounted() {
    this.getTypeConfig();
    this.setOkrApprovalStep('1');
  },
  methods: {
    ...mapMutations('common', ['setOkrApprovalStep']),
    // 查询综合管理员是否可审批
    getTypeConfig() {
      // 综合管理员默认不能审批
      if (this.roleCode.includes('TEAM_ADMIN') && !this.roleCode.includes('ORG_ADMIN')) {
        this.canApproval = false;
        const params = {
          configType: 'OKR',
          configTypeDetail: 'O-3',
          level: 'O',
          sourceId: this.userInfo.orgId,
        };
        this.server.getTypeConfig(params).then((res) => {
          if (res.code == 200) {
            const configItem = res.data[0] || {};
            this.canApproval = configItem.configItemCode == 'O';
          }
        });
      }
    },
  },
  watch: {},
};
</script>