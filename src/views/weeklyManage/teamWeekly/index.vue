<template>
  <div class="tenant-management">
    <div class="page-title">团队周报</div>
    <div class="operating-area">
      <div>
        <tl-calendar
          @setCalendarId="setCalendarId"
          @getWeeklyById="refreshPageList"
          :isFromTeam="true"
        ></tl-calendar>
      </div>
      <div>
        <el-cascader
          v-model="orgIdList"
          :options="treeData"
          :show-all-levels="false"
          :props="{ checkStrictly: true,value:'orgId',label:'orgName',children:'sonTree' }"
          @change="selectIdChange"
        ></el-cascader>
        <el-select
          v-model="formData.queryType"
          @change="lookChange"
          placeholder="周报速看"
          clearable
          @clear="clear"
        >
          <el-option
            v-for="item in lookItemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button @click="remindWriteWeekly" icon="el-icon-phone">提醒写周报</el-button>
      </div>
      <div class="operating-panel">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-select
              v-model="submitedOrLooked"
              @change="submitedOrLookedChange"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in submitedOrLookedList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              maxlength="64"
              @keyup.enter.native="refreshPageList"
              v-model="formData.userName"
              placeholder="请输入成员姓名"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="refreshPageList"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cont-area">
      <crcloud-table
        :total="total"
        :currentPage.sync="formData.currentPage"
        :pageSize.sync="formData.pageSize"
        @searchList="refreshPageList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed prop="userName" label="姓名"></el-table-column>
            <el-table-column fixed prop="orgName" label="所在团队"></el-table-column>
            <el-table-column v-if="formData.queryType == '0'" fixed prop="workContent" label="工作项"></el-table-column>
            <el-table-column
              v-if="formData.queryType == '1'"
              fixed
              prop="thoughtContent"
              label="感想"
            ></el-table-column>
            <el-table-column v-if="formData.queryType == '2'" fixed prop="planContent" label="下周计划"></el-table-column>
            <el-table-column v-if="formData.queryType == '3'" fixed prop="orgName" label="有进展的KR">
              <template slot-scope="scope">
                <div>{{scope.row.pokrDetailObjectKr ? scope.row.okrDetailObjectKr : '--'}}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="formData.queryType == '3'" fixed prop="orgName" label="所属O">
              <template slot-scope="scope">
                <div>{{scope.row.pokrDetailObjectKr ? scope.row.pokrDetailObjectKr : scope.row.pokrDetailObjectKr}}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="formData.queryType == '3'" fixed prop="orgName" label="本周变化">
              <template slot-scope="scope">
                <div>{{scope.row.progressAfter - scope.row.progressBefor }}</div>
              </template>
            </el-table-column>
            <el-table-column fixed label="角色" v-if="!formData.queryType">
              <template slot-scope="scope">
                <span>{{scope.row.isadmin == '1'?'部门负责人':'--'}}</span>
                <!-- 团队成员 -->
              </template>
            </el-table-column>
            <el-table-column fixed prop="weeklyId" label="状态" v-if="!formData.queryType">
              <template slot-scope="scope">
                <span>{{scope.row.weeklyId ?'已提交':'未提交'}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed prop="tenantBuId" label="查看类型" v-if="!formData.queryType">
              <template slot-scope="scope">
                <span>{{scope.row.visitId ?'已查看':'未查看'}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed prop="weeklyEmotion" label="本周心情" v-if="!formData.queryType">
              <template slot-scope="scope">
                <span v-if="scope.row.weeklyEmotion == '100'">开心</span>
                <span v-if="scope.row.weeklyEmotion == '50'">平常</span>
                <span v-if="scope.row.weeklyEmotion == '0'">沮丧</span>
              </template>
            </el-table-column>
            <el-table-column fixed prop="updateTime" label="更新时间" v-if="!formData.queryType">
              <template slot-scope="scope">
                <div>{{dateFormat('YYYY-mm-dd HH:MM:SS',new Date(scope.row.updateTime) )}}</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="130">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.weeklyId"
                  type="text"
                  size="small"
                  @click="weeklyInfo(scope.row)"
                >查看</el-button>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-create-tenant
      v-if="exist"
      :exist.sync="exist"
      :title="title"
      :tenantId="tenantId"
      @getTeamWeekly="refreshPageList"
      :infoBool="infoBool"
    ></tl-create-tenant>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import calendar from '../myWeekly/components/calendar';
import Server from './server';

const server = new Server();
export default {
  name: 'teamWeekly',
  components: {
    'tl-calendar': calendar,
  },
  data() {
    return {
      server,
      tableData: [],
      orgIdList: [],
      treeData: [],
      formData: {
        calendarId: '',
        looked: '',
        orgId: '',
        projectName: '',
        queryType: '',
        submited: '',
        userName: '',
        pageSize: 10,
        currentPage: 1,
      },
      total: 0,
      exist: false,
      tenantId: null,
      lookItemList: [
        {
          value: '0',
          label: '工作项',
        },
        {
          value: '1',
          label: '感想',
        },
        {
          value: '2',
          label: '下周计划',
        },
        {
          value: '3',
          label: 'OKR',
        },
      ],
      submitedOrLookedList: [
        {
          value: '1',
          label: '已查看',
        },
        {
          value: '2',
          label: '未查看',
        },
        {
          value: '3',
          label: '已提交',
        },
        {
          value: '4',
          label: '未提交',
        },
      ],
      submitedOrLooked: '',
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    init() {
      this.formData.orgId = this.userInfo.orgId;
      // 查询列表数据（默认查询当前用户所在团队数据）
      // this.refreshPageList();
      // 查询组织树
      this.getOrgTree();
    },
    getTeamWeekly() {
      const params = {
        ...this.formData,
      };
      this.server.queryTeamWeeklyList(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.total = res.data.total;
          this.formData.currentPage = res.data.currentPage;
          this.formData.pageSize = res.data.pageSize;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    weeklyInfo(weekly) {
      this.go('teamWeeklyInfo', { query: { weeklyId: weekly.weeklyId, userName: weekly.userName, headerUrl: weekly.headerUrl } });
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
        if (element.orgId == this.formData.orgId) {
          // 定位到了该组织
          this.orgIdList = element.orgFullId.split(':');
          this.orgIdList.pop();
        }
      });
    },
    selectIdChange(data) {
      // 清空其他查询条件
      this.formData.looked = '';
      this.formData.submited = '';
      this.formData.userName = '';
      this.submitedOrLooked = '';
      this.formData.queryType = '';
      // 根据组织查数据
      this.formData.orgId = data[data.length - 1];
      this.orgIdList = data;
      this.getTeamWeekly();
    },
    getOrgTree() {
      this.server.getOrg({}).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
          // 将用户所属组织初始化给组织树下拉框
          this.setInitOrg();
        }
      });
    },
    setCalendarId(id) {
      this.formData.calendarId = id;
    },
    remindWriteWeekly() {
      this.server.remindWriteWeekly().then((res) => {
        if (res.code == 200) {
          this.$message.success('提醒成功');
        }
      });
    },
    lookChange(queryType) {
      this.formData.queryType = queryType;
      if (queryType) {
        this.server.lookQuickly(this.formData).then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.content;
            this.total = res.data.total;
            this.formData.currentPage = res.data.currentPage;
            this.formData.pageSize = res.data.pageSize;
          }
        });
      } else {
        this.getTeamWeekly();
      }
    },
    clear() {
      this.formData.queryType = '';
      this.getTeamWeekly();
    },
    submitedOrLookedChange(item) {
      switch (item) {
        case '1':
          this.formData.looked = true;
          this.formData.submited = '';
          break;
        case '2':
          this.formData.looked = false;
          this.formData.submited = '';
          break;
        case '3':
          this.formData.submited = true;
          this.formData.looked = '';
          break;
        case '4':
          this.formData.submited = false;
          this.formData.looked = '';
          break;
        default:
          break;
      }
      this.refreshPageList();
    },
    refreshPageList() {
      if (this.formData.queryType) {
        this.server.lookQuickly(this.formData).then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.content;
            this.total = res.data.total;
            this.formData.currentPage = res.data.currentPage;
            this.formData.pageSize = res.data.pageSize;
          }
        });
      } else {
        this.getTeamWeekly();
      }
    },
  },

};
</script>