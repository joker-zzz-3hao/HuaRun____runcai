<!--
  功能：
  作者：王志任
  时间：2020年12月01日 10:34:43
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <el-button @click="addOrEditEvaluate()">添加评定</el-button>
    </div>
    <div class="cont-area">
      <crcloud-table :isPage="false" @searchList="searchList">
        <div slot="tableContainer" class="table-container">
          <el-table
            ref="performanceEvaluate"
            v-loading="loading"
            :data="evaluateData"
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
              </template></el-table-column
            >
            <el-table-column
              label="设置时间"
              align="left"
              prop="createTime"
              min-width="165px"
              ><template slot-scope="scope">
                <div>
                  {{
                    dateFormat(
                      "YYYY-mm-dd HH:MM:SS",
                      new Date(scope.row.createTime)
                    )
                  }}
                </div>
              </template></el-table-column
            >
            <el-table-column
              label="更新时间"
              align="left"
              prop="updateTime"
              min-width="165px"
              ><template slot-scope="scope">
                <div>
                  {{
                    dateFormat(
                      "YYYY-mm-dd HH:MM:SS",
                      new Date(scope.row.updateTime)
                    )
                  }}
                </div>
              </template></el-table-column
            >
            <el-table-column
              label="添加人"
              align="left"
              prop="createUserName"
              min-width="100px"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="left"
              width="120px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status > 0"
                  type="text"
                  @click="addOrEditEvaluate(scope.row)"
                  size="small"
                >
                  详情</el-button
                >
                <el-tooltip
                  v-if="scope.row.status > 0"
                  effect="dark"
                  :content="'绩效评定已分配给部门，不能编辑'"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <el-button
                    type="text"
                    style="color: #9e9e9e; cursor: default"
                    size="small"
                  >
                    编辑</el-button
                  >
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  @click="addOrEditEvaluate(scope.row)"
                  size="small"
                >
                  编辑</el-button
                >
                <el-tooltip
                  v-if="scope.row.status > 0"
                  effect="dark"
                  :content="'绩效评定已分配给部门，不能删除'"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <el-button
                    type="text"
                    style="color: #9e9e9e; cursor: default"
                    size="small"
                  >
                    删除</el-button
                  >
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  size="small"
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
