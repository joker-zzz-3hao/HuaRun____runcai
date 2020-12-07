<!--
  功能：
  作者：王志任
  时间：2020年12月01日 10:34:43
  备注：
-->
<template>
  <div>
    <div>
      <span>评定规则</span>
      <el-select
        v-model.trim="ruleId"
        placeholder="添加评定规则"
        :popper-append-to-body="false"
        popper-class="tl-select-dropdown"
        class="tl-select"
        @change="addOrEditAmount"
      >
        <el-option
          v-for="item in ruleList"
          :key="item.ruleId"
          :label="item.ruleName"
          :value="item.ruleId"
        ></el-option>
      </el-select>
    </div>
    <div>
      <dl v-for="item in ruleRowList" :key="item">
        <dt>{{ item.ruleName }}</dt>
        <dd v-for="item in item.amount" :key="item">{{ item }}</dd>
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
      ruleRowList: [],

    };
  },
  created() { this.init(); },
  mounted() {},
  computed: {},
  methods: {
    init() {
      this.searchList();
      this.getRuleList();
    },
    searchList() {
      this.server.orgQuery().then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.orgData = res.data;
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
    addOrEditAmount(ruleId) {
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.addOrEditAmount.show(ruleId);
      });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
