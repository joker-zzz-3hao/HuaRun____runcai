<template>
  <div>
    <div v-show="showTable">
      <tl-okr-table
        :tableList="tableList"
        :disabled="false"
        :showOKRInfoLabel="true"
        :status="searchForm.status"
        @openDialog="openDialog"
      >
        <template slot="head-bar" slot-scope="props">
          <el-button
            v-if="props.okritem.continueCount>0"
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图icon{{props.okritem.continueCount}}</el-button>
        </template>
        <template slot="body-bar" slot-scope="props">
          <el-button
            v-if="props.okritem.continueCount>0"
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图icon{{props.okritem.continueCount}}</el-button>
        </template>
      </tl-okr-table>
    </div>
    <div v-show="tableList.length==0">
      <el-button type="primary">创建OKR</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrTable from '@/components/okrTable';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'tl-okr-table': okrTable,
  },
  props: ['periodId'],
  data() {
    return {
      showTable: false,
      server,
      CONST,
      tableList: [],
      searchForm: {
        status: '1',
      },
      dialogExist: false,
      currentView: '', // 弹框组件
      okrId: '',
      okrItem: {},
      drawer: false,
      writeInfo: {
        canWrite: '',
      },
      drawerTitle: '创建okr',
      okrCycle: {}, // 当前选择的周期
      periodList: [], // 周期列表
    };
  },
  computed: {
    ...mapState('common', {
      setOrgId: (state) => state.setOrgId,
    }),
  },
  mounted() {
    this.searchOkr();
  },
  methods: {
    goUndertakeMaps(id, name) {
      this.$router.push({
        name: 'undertakeMaps',
        params: {
          okrDetailId: id, objectName: name, showOne: true, periodId: this.okrCycle.periodId, orgId: this.okrId,
        },
      });
    },
    searchOkr() { // 默认搜索进行时
      this.showTable = false;
      this.server.getmyOkr({
        myOrOrg: 'org',
        periodId: this.periodId,
        status: this.searchForm.status,
        orgId: this.setOrgId,
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails || [];
          this.okrMain = res.data.okrMain || {};
          this.okrId = this.okrMain.okrId || '';
          this.memberList = res.data.orgUser || [];
          this.orgTable = res.data.orgTable || [];
          if (this.tableList.length > 0) {
            this.showTable = true;
          }
        }
      });
    },
  },
  watch: {
    periodId: {
      handler() {
        this.searchOkr();
      },
      deep: true,
    },
  },
};
</script>
<style  scoped>
[v-cloak] {
  display: none;
}
</style>