<!--
  功能：
  作者：王志任
  时间：2020年12月01日 10:34:43
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <div class="page-title">绩效管理</div>
      <div class="operating-box">
        <dl class="dl-item">
          <dt>OKR周期</dt>
          <dd>
            <el-select
              :disabled="periodList.length == 0"
              v-model="searchForm.periodId"
              placeholder="请选择目标周期"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select has-bg w180"
              @change="periodChange"
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
        <!-- <dl class="dl-item">
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
        </dl> -->
      </div>
    </div>
    <div class="cont-area">
      <div class="cont-panel">
        <dl class="dl-list">
          <dt>绩效评定规则</dt>
          <dd>
            <el-dropdown @command="addAmount">
              <span class="el-dropdown-link">
                <i class="el-icon-plus"></i>
                添加评定规则
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in ruleList"
                  :key="item.ruleId"
                  :command="item.ruleId"
                  >{{ item.ruleName }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </dd>
        </dl>
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
            {{ item.value + item.unit }}
            （
            <em>{{ item.applyValue }}</em>
            个）
          </dd>
          <dd>
            <el-button
              type="text"
              class="tl-btn"
              @click="deleteRule(amountData)"
              >删除</el-button
            >
          </dd>
          <dd>
            <el-button
              class="tl-btn"
              type="text"
              @click="updateAmount(amountData)"
              >修改</el-button
            >
          </dd>
        </dl>

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
                min-width="100px"
              ></el-table-column>
              <el-table-column
                label="负责人"
                align="left"
                prop="userName"
                min-width="90px"
              ></el-table-column>
              <el-table-column
                v-for="column in colums"
                :key="column.name"
                :label="column.label"
                align="left"
                min-width="200px"
                :prop="column.name"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[column.name] || "暂未设置" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="left"
                width="100px"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="tl-btn"
                    @click="allocateAmount(scope.row)"
                  >
                    设置</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </crcloud-table>
      </div>
    </div>
    <tl-create-evaluate
      ref="addOrEditAmount"
      v-if="showDialog"
      :showDialog.sync="showDialog"
      :server="server"
      @refreshRule="refreshRule"
      @refreshPage="searchList"
    ></tl-create-evaluate>
    <tl-allocate-amount
      ref="allocateAmount"
      v-if="showAllocateDialog"
      :showAllocateDialog.sync="showAllocateDialog"
      :server="server"
      :rowData="rowData"
      :periodId="searchForm.periodId"
      :amountDataCopy="amountDataList"
      @refreshPage="searchList"
    ></tl-allocate-amount>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import addOrEditAmount from './components/addOrEditAmount';
import allocateAmount from './components/allocateAmount';
import Server from './server';

const server = new Server();

export default {
  name: '',
  components: {
    'tl-create-evaluate': addOrEditAmount,
    'tl-allocate-amount': allocateAmount,
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
      showAllocateDialog: false,
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
      colums: [],
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
      this.searchForm.orgId = this.userInfo.orgId;
      this.getRuleList();
      this.getOkrCycleList();
      // this.getOrgTree();
    },
    searchList() {
      this.loading = true;
      this.server.orgQuery({
        // orgId: this.searchForm.orgId,
        periodId: this.searchForm.periodId,
      }).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.colums = res.data.colums;
          this.orgData = res.data.rows;
        }
      });
    },
    periodChange() {
      this.searchList();
      this.getAmountData();
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
          // periodRuleDetailList.forEach(element => {
          this.amountDataList.forEach((element) => {
            element.periodRuleDetailList.forEach((item) => {
              if (!this.hasValue(item.applyValue)) {
                item.applyValue = 0;
              }
            });
          });
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
      // 根据组织查数据
      this.searchForm.orgId = data[data.length - 1];
      this.orgIdList = data;
      // this.getTeamWeekly();
      this.$refs.cascader.dropDownVisible = false;
      this.searchList();
    },
    addAmount(ruleId) {
      // 判断是否支持编辑，如果不支持，弹出警告提示
      this.searchForm.ruleId = ruleId;
      for (let i = 0; i < this.amountDataList.length; i += 1) {
        if (this.amountDataList[i].ruleId == ruleId) {
          this.updateAmount(this.amountDataList[i]);
          return;
        }
      }
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
    allocateAmount(data) {
      if (this.amountDataList && this.amountDataList.length > 0) {
        this.rowData = data;
        this.showAllocateDialog = true;
        this.$nextTick(() => {
          this.$refs.allocateAmount.show();
        });
      } else {
        this.$message.warning('暂无可用绩效规则，请先添加绩效规则');
      }
    },
    deleteRule(amountData) {
      // 如果已被分配了名额则不能被删除TODO:
      // if (amountData.status) {
      //   this.$message.warning('该规则已被使用，不可删除。');
      //   return;
      // }
      this.$xconfirm({ title: '确认删除', content: '' }).then(() => {
        this.server.deleteRule({
          periodRuleId: amountData.periodRuleId,
          periodId: this.searchForm.periodId,
        }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.searchList();
            this.getAmountData();
          }
        });
      });
    },
    refreshRule() {
      this.getAmountData();
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
.text-gray {
  color: gray;
}
</style>
