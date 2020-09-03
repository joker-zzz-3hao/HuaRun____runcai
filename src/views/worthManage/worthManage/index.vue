<template>
  <div class="role-type">
    <div class="operating-area">
      <div class="page-title">价值观事件簿</div>
      <div class="operating-panel">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item label="组织">
            <div @click="showCascader=!showCascader">
              <el-input v-model="formData.orgName" style="width: 200px;"></el-input>
            </div>
            <el-cascader-panel
              v-model="formData.orgFullId"
              :style="{display: showCascader ? '' : 'none'}"
              :options="departmentData"
              :show-all-levels="false"
              @change="selectIdChange"
              :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgFullId',label:'orgName',children:'children' }"
            ></el-cascader-panel>
          </el-form-item>
          <el-form-item label="价值观">
            <el-select v-model.trim="formData.worthId" placeholder="请选择" @change="changeSearch">
              <el-option
                v-for="item in worthList"
                :key="item.id"
                :label="item.cultureName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评分">
            <el-select v-model.trim="formData.scoreId" placeholder="请选择" @change="changeSearch">
              <el-option
                v-for="item in CONST.SCORE_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="userName" label="员工" min-width="140">
              <template slot-scope="scope">
                <div>
                  <div class="user-info">
                    <img v-if="scope.row.headUrl" :src="scope.row.headUrl" alt />
                    <div
                      v-else-if="scope.row.userName"
                      class="user-name"
                    >{{scope.row.userName.substring(scope.row.userName.length-2)}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="cultureName" label="支撑价值观" min-width="180"></el-table-column>
            <el-table-column prop="workContent" label="工作项" min-width="120"></el-table-column>
            <el-table-column prop="updateTime" label="评分" min-width="160"></el-table-column>
            <el-table-column prop="updateTime" label="评分时间" min-width="160"></el-table-column>
            <el-table-column prop="updateTime" label="支撑时间" min-width="160"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="goWeekly(scope.row)" type="text" class="tl-btn">查看周报</el-button>
                <el-button @click="goWeekly(scope.row)" type="text" class="tl-btn">评分</el-button>
                <el-button @click="goWeekly(scope.row)" type="text" class="tl-btn">评分详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'worthManage',
  data() {
    return {
      server,
      CONST,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      formData: {
        scoreId: '',
        worthId: '',
        orgName: '',
        orgFullId: '',
      },
      tableData: [],
      worthList: [],
      departmentData: [],
      orgFullIdList: [],
      showCascader: false,
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mixins: [global],
  mounted() {
    this.server.queryCultureList().then((res) => {
      if (res.code == '200') {
        this.worthList = res.data;
        if (this.worthList.length > 0) {
          this.worthList.push({
            id: '',
            cultureName: '全部',
          });
        }
      }
    });
    this.getOrgTable();
  },
  methods: {
    searchList() {
      if (this.formData.orgFullId) {
        this.server.weeklyEvents({
          cultureId: this.formData.worthId,
          score: this.formData.scoreId,
          orgFullId: this.formData.orgFullId,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }).then((res) => {
          if (res.code == '200') {
            this.tableData = res.data.content;
            this.total = res.data.total;
          }
        });
      }
    },
    selectIdChange(data) {
      this.showCascader = false;
      this.orgFullId = data[data.length - 1];
      this.orgFullIdList = this.orgFullId.split(':');
      this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.getOrgName(this.departmentData, 0);
    },
    getOrgTable() {
      // 查询组织树
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData.push(res.data);
            this.formData.orgFullId = this.departmentData[0].orgFullId;
            this.searchList();
          }
        }
      });
    },
    getOrgName(data, index) {
      data.forEach((item) => {
        if (this.orgFullIdList[index] == item.orgId) {
          if (item.children && item.children.length > 0 && this.orgFullIdList[index + 1]) {
            this.getOrgName(item.children, index + 1);
          } else if ((index + 1) == this.orgFullIdList.length) {
            this.formData.orgName = item.orgName;
          }
        }
      });
    },
    changeSearch() {
      this.searchList();
    },
    goWeekly(data) {
      console.log(data);
    },
  },

};
</script>