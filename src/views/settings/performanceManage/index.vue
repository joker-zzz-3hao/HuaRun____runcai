<!--
  功能：
  作者：王志任
  时间：2020年12月01日 10:34:43
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <div class="operating-box">
        <dl class="dl-item">
          <dt>OKR周期</dt>
          <dd>
            <!-- multiple 多选属性 -->
            <!-- searchForm.periodId 单选 -->
            <!-- multperiod 多选 -->
            <el-select
              :disabled="periodList.length == 0"
              v-model="searchForm.periodId"
              placeholder="请选择目标周期"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="item in periodList"
                :key="item.periodId"
                :label="item.periodName"
                :value="item.periodId"
              ></el-option>
            </el-select>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>部门</dt>
          <dd>
            <el-cascader
              v-model="orgIdList"
              ref="cascader"
              :options="treeData"
              :show-all-levels="false"
              :props="{
                checkStrictly: true,
                value: 'orgId',
                label: 'orgName',
                children: 'sonTree',
              }"
              @change="selectIdChange"
              popper-class="tl-cascader-popper"
              class="tl-cascader"
            ></el-cascader>
          </dd>
        </dl>
        <div>
          <span>评定规则</span>
          <el-select
            v-model.trim="searchForm.ruleId"
            placeholder="添加评定规则"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
            @change="addAmount"
          >
            <el-option
              v-for="item in ruleList"
              :key="item.ruleId"
              :label="item.ruleName"
              :value="item.ruleId"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div>
      <dl
        class="layout-flex"
        v-for="amountData in amountDataList"
        :key="amountData.periodRuleId"
      >
        <dt>{{ amountData.ruleName + "：" }}</dt>
        <dd
          v-for="item in amountData.periodRuleDetailList"
          :key="item.periodRuleDetailId"
          class="layout-flex dd-margin"
        >
          {{ item.value + "（" + item.applyValue + "个）" }}
        </dd>
        <dd><el-button type="text">删除</el-button></dd>
        <dd>
          <el-button type="text" @click="updateAmount(amountData)"
            >修改</el-button
          >
        </dd>
      </dl>
    </div>
    <div class="cont-area">
      <crcloud-table :isPage="false" @searchList="searchList">
        <div slot="tableContainer" class="table-container">
          <el-table
            ref="performanceEvaluate"
            v-loading="loading"
            :data="orgData"
          >
            <el-table-column
              label="部门"
              align="left"
              prop="orgName"
              min-width="150px"
            ></el-table-column>
            <el-table-column
              label="负责人"
              align="left"
              prop="userName"
              min-width="150px"
            ></el-table-column>
            <el-table-column label="奖金系数" align="left" min-width="200px">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.ruleDetailList"
                  :key="item.ruleId"
                >
                  {{ item.value + item.unit
                  }}{{
                    scope.row.ruleDetailList.length - 1 != index ? "、" : ""
                  }}
                </span>
              </template></el-table-column
            >
            <el-table-column
              label="成员等级系数"
              align="left"
              min-width="200px"
            >
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.ruleDetailList"
                  :key="item.ruleId"
                >
                  {{ item.value + item.unit
                  }}{{
                    scope.row.ruleDetailList.length - 1 != index ? "、" : ""
                  }}
                </span>
              </template></el-table-column
            >

            <el-table-column
              label="操作"
              align="left"
              width="120px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="addOrEditAmount(scope.row)"
                  size="small"
                >
                  设置</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-create-evaluate
      ref="addOrEditAmount"
      v-if="showDialog"
      :showDialog.sync="showDialog"
      :server="server"
      :rowData="rowData"
      @refreshPage="searchList"
    ></tl-create-evaluate>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import addOrEditAmount from './components/addOrEditAmount';
import Server from './server';

const server = new Server();

export default {
  name: '',
  components: {
    'tl-create-evaluate': addOrEditAmount,
  },
  props: {},
  data() {
    return {
      server,
      loading: false,
      ruleId: '',
      ruleList: [],
      orgData: [],
      showDialog: false,
      rowData: {},
      periodList: [],
      searchForm: {
        periodId: '',
        orgId: '',
        ruleId: '',
      },
      orgIdList: [],
      treeData: [],
      amountDataList: [],

    };
  },
  created() { this.init(); },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    init() {
      // 自己团队还要判断是否开发周报么?
      this.searchForm.orgId = this.userInfo.orgId;

      this.getRuleList();
      this.getOkrCycleList();
      this.getOrgTree();
    },
    searchList() {
      this.server.orgQuery({
        orgId: this.searchForm.orgId,
        periodId: this.searchForm.periodId,
      }).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.orgData = res.data.rows;
        }
      });
    },
    getRuleList() {
      this.server.getRuleList().then((res) => {
        if (res.code == 200) {
          this.ruleList = res.data;
        }
      });
    },
    // 周期
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          const okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.searchForm.periodId = okrCycle.periodId;
          this.searchList();
          this.getAmountData();
        }
      });
    },
    getOrgTree() {
      this.server.getOrg({}).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
          // // 将用户所属组织初始化给组织树下拉框
          this.setInitOrg();
          // // 初始化下拉框用户列表
          // this.remoteMethod();
        }
      });
    },
    getAmountData() {
      this.server.getAmountData({
        periodId: this.searchForm.periodId,
        applyId: this.userInfo.tenantId,
        applyType: 1,

      }).then((res) => {
        if (res.code == 200) {
          this.amountDataList = res.data;
        }
      });
    },
    setInitOrg() {
      // 遍历嵌套数组，转换为一维数组
      const queue = [...this.treeData];
      const result = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        result.push({
          orgId: next.orgId,
          orgName: next.orgName,
          orgFullId: next.orgFullId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      // 找到该用户所在组织树对应的orgFullId
      result.forEach((element) => {
        if (element.orgId == this.searchForm.orgId) {
          // 定位到了该组织
          this.orgIdList = element.orgFullId.split(':');
          this.orgIdList.pop();
        }
      });
    },
    selectIdChange(data) {
      console.log(this.searchForm);
      // 根据组织查数据
      this.searchForm.orgId = data[data.length - 1];
      this.orgIdList = data;
      // this.getTeamWeekly();
      this.$refs.cascader.dropDownVisible = false;
    },
    addAmount(ruleId) {
      let selectedRule = {};
      this.ruleList.forEach((rule) => {
        if (rule.ruleId == ruleId) {
          selectedRule = rule;
        }
      });
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.addOrEditAmount.show(selectedRule, this.searchForm, this.userInfo.tenantId);
      });
    },
    updateAmount(data) {
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.addOrEditAmount.show(data, this.searchForm, this.userInfo.tenantId);
      });
    },
  },
  watch: {

  },
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.layout-flex {
  display: flex;
}
.dd-margin {
  margin-right: 10px;
}
</style>
