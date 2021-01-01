<template>
  <div class="performance-evaluation">
    <div class="operating-area">
      <div class="operating-box">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addOrEditEvaluate()"
          class="tl-btn amt-bg-slip"
          >添加绩效评定</el-button
        >
      </div>
    </div>
    <div class="cont-area">
      <crcloud-table :isPage="false" @searchList="searchList">
        <div slot="tableContainer" class="table-container">
          <el-table
            ref="performanceEvaluate"
            v-loading="loading"
            :data="evaluateData"
            class="tl-table"
          >
            <el-table-column
              label="评定方式"
              align="left"
              prop="ruleName"
              min-width="150px"
            ></el-table-column>
            <el-table-column label="内容" align="left" min-width="200px">
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
              </template>
            </el-table-column>
            <el-table-column
              label="设置时间"
              align="left"
              prop="createTime"
              min-width="165px"
            >
              <template slot-scope="scope">
                <div>
                  {{ dateFormat("YYYY-mm-dd HH:MM:SS", scope.row.createTime) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="更新时间"
              align="left"
              prop="updateTime"
              min-width="165px"
            >
              <template slot-scope="scope">
                <div>
                  {{ dateFormat("YYYY-mm-dd HH:MM:SS", scope.row.updateTime) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="添加人"
              align="left"
              prop="createUserName"
              min-width="100px"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="left"
              width="140px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status > 0"
                  type="text"
                  class="tl-btn"
                  @click="addOrEditEvaluate(scope.row)"
                  >详情</el-button
                >
                <el-tooltip
                  v-if="scope.row.status > 0"
                  effect="dark"
                  :content="'绩效评定已分配给部门，不能编辑'"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <el-button type="text" class="tl-btn is-disabled">
                    编辑</el-button
                  >
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  class="tl-btn"
                  @click="addOrEditEvaluate(scope.row)"
                  >编辑</el-button
                >
                <el-tooltip
                  v-if="scope.row.status > 0"
                  effect="dark"
                  :content="'绩效评定已分配给部门，不能删除'"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <el-button type="text" class="tl-btn is-disabled">
                    删除</el-button
                  >
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  class="tl-btn"
                  :disabled="false"
                  @click="removeEvaluate(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-create-evaluate
      ref="createEvaluate"
      v-if="showDialog"
      :showDialog.sync="showDialog"
      :server="server"
      :rowData="rowData"
      @refreshPage="searchList"
    ></tl-create-evaluate>
  </div>
</template>

<script>
import addOrEditEvaluate from './components/addOrEditEvaluate';
import Server from './server';

const server = new Server();

export default {
  name: '',
  components: {
    'tl-create-evaluate': addOrEditEvaluate,
  },
  props: {},
  data() {
    return {
      server,
      loading: false,
      evaluateData: [],
      showDialog: false,
      rowData: {},
    };
  },
  created() { this.searchList(); },
  mounted() {},
  computed: {},
  methods: {
    searchList() {
      this.server.getEvaluateList().then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.evaluateData = res.data;
        }
      });
    },
    addOrEditEvaluate(rowData) {
      // this.rowData = {};
      if (rowData && rowData.ruleId) {
        // this.rowData = rowData;
      }
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.createEvaluate.show(rowData);
      });
    },
    removeEvaluate(rowData) {
      this.$xconfirm({
        title: '确认删除？',
        content: '',
      }).then(() => {
        this.server.removeEvaluate({ ruleId: rowData.ruleId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.searchList();
          }
        });
      });
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
