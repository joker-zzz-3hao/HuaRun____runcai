<!--
  功能：
  作者：王志任
  时间：2020年12月01日 10:34:43
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <el-button @click="addEvaluate">添加评定</el-button>
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
            ></el-table-column>
            <el-table-column
              label="内容"
              align="left"
              prop=""
            ></el-table-column>
            <el-table-column
              label="设置时间"
              align="left"
              prop="createTime"
            ></el-table-column>
            <el-table-column
              label="更新时间"
              align="left"
              prop="updateTime"
            ></el-table-column>
            <el-table-column
              label="添加人"
              align="left"
              prop="createUserName"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="left"
              width="100px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="hasPower('sys_dictionary_update')"
                  type="text"
                  @click="editDic(scope.row)"
                  size="small"
                  >修改</el-button
                >

                <el-button
                  v-if="hasPower('sys_dictionary_delete')"
                  type="text"
                  size="small"
                  @click="deleteDic(scope.row)"
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
      :optionType="optionType"
      @closeDialog="closeDialog"
    ></tl-create-evaluate>
  </div>
</template>

<script>
import createEvaluate from './components/createEvaluate';
import Server from './server';

const server = new Server();

export default {
  name: '',
  components: {
    'tl-create-evaluate': createEvaluate,
  },
  props: {},
  data() {
    return {
      server,
      loading: false,
      evaluateData: [],
      showDialog: false,
      optionType: '',
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
    addEvaluate() {
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.createEvaluate.show();
      });
    },
    closeDialog() {
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
