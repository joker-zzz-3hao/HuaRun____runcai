<template>
  <div class="working-hours hours-join">
    <div class="operating-area">
      <el-button plain @click="back()" class="tl-btn amt-border-slip">
        返回
        <span class="lines"></span>
      </el-button>
    </div>
    <div class="cont-area">
      <div class="operating-box">
        <dl class="dl-item">
          <dt>选择调配工时项目</dt>
          <dd>
            <el-select
              v-model="formData.projectId"
              :popper-append-to-body="false"
              placeholder="请选择项目"
              @change="changeProject"
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index + item.projectId"
                :label="item.projectNameCn"
                :value="item.projectId"
              ></el-option>
            </el-select>
          </dd>
        </dl>
      </div>
      <div class="project-info">
        <div class="project-description">
          <dl>
            <dt></dt>
            <dd>
              <span>项目名称:</span>
              <p>
                {{ projectInfo.projectNameCn }}
              </p>
            </dd>
          </dl>
          <div class="dl-list">
            <dl class="dl-item">
              <dt><span>项目经理</span></dt>
              <dd>
                {{ projectInfo.projectManager }}
              </dd>
            </dl>
            <dl class="dl-item">
              <dt><span>项目所属部门</span></dt>
              <dd>
                {{ projectInfo.orgName }}
              </dd>
            </dl>
            <dl class="dl-item">
              <dt><span>内部同事预算</span></dt>
              <dd>
                <em
                  v-money="{
                    value: projectInfo.insideBudget || 0,
                    precision: 2,
                  }"
                ></em
                ><span>元</span
                ><span>({{ projectInfo.currency || "人民币" }})</span>
              </dd>
            </dl>
            <dl class="dl-item">
              <dt><span>外部同事预算</span></dt>

              <dd>
                <em
                  v-money="{
                    value: projectInfo.outerConsultBudget || 0,
                    precision: 2,
                  }"
                ></em
                ><span>元</span
                ><span>({{ projectInfo.currency || "人民币" }})</span>
              </dd>
            </dl>
            <dl class="dl-item project-type">
              <dt><span>项目类型</span></dt>
              <dd>
                {{ CONST.PROJECT_TYPE_MAP[projectInfo.projectTypeCode] }}
              </dd>
            </dl>
            <dl class="dl-item project-type">
              <dt><span>已用人力成本</span></dt>
              <dd>
                <em
                  v-money="{
                    value:
                      projectCost.externalConsultants +
                        projectCost.internalConsultant || 0,
                    precision: 2,
                  }"
                ></em
                ><span>元</span
                ><span>({{ projectInfo.currency || "人民币" }})</span>
                <em
                  ><span>=</span><span>外部同事成本(</span
                  ><em
                    v-money="{
                      value: projectCost.externalConsultants,
                      precision: 2,
                    }"
                    >{{ projectCost.externalConsultants || 0 }}</em
                  ><span
                    >{{ projectInfo.currency || "人民币" }}) +
                    内部同事成本(</span
                  ><em
                    v-money="{
                      value: projectCost.internalConsultant || 0,
                      precision: 2,
                    }"
                    >{{ projectCost.internalConsultant || 0 }}</em
                  ><span>{{ projectInfo.currency || "人民币" }})</span></em
                >
              </dd>
            </dl>
            <dl class="dl-item">
              <dt><span>项目时间</span></dt>
              <dd>
                {{ projectInfo.projectBeginDate }} 至
                {{ projectInfo.projectApplyDate }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="operating-box-group">
        <div class="operating-box">
          <dl class="dl-item">
            <dt>按时间</dt>
            <dd>
              <el-date-picker
                v-model="weekLine"
                type="daterange"
                @change="searchList"
                @clear="searchList"
                clearable
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="tl-range-editor"
                popper-class="tl-range-popper"
              >
              </el-date-picker>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt>组织</dt>
            <dd>
              <el-cascader
                clearable
                v-model="orgId"
                ref="cascader"
                :options="treeData"
                :show-all-levels="false"
                :props="{
                  checkStrictly: true,
                  value: 'orgId',
                  label: 'orgName',
                  children: 'sonTree',
                  emitPath: false,
                }"
                @change="changeOrg"
                popper-class="tl-cascader-popper"
                class="tl-cascader"
              ></el-cascader>
            </dd>
          </dl>
          <dl class="dl-item">
            <dd>
              <el-input
                maxlength="64"
                clearable
                v-model="keyWord"
                placeholder="成员姓名，工作项"
                class="tl-input-search"
              >
                <i class="el-icon-search" slot="prefix" @click="searchList"></i>
              </el-input>
              <el-button plain class="tl-btn light" @click="searchList">
                搜索
              </el-button>
            </dd>
          </dl>
        </div>
      </div>
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container project-members">
          <el-table
            :data="tableData"
            class="tl-table"
            @select="selectUser"
            ref="table"
            @select-all="selectUser"
            @selection-change="selectUser"
            row-key="workId"
          >
            <el-table-column
              :reserve-selection="true"
              type="selection"
              column-key="workId"
              width="55"
            >
            </el-table-column>
            <el-table-column prop="userName" label="提交人" min-width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="orgName" min-width="200px">
            </el-table-column>
            <el-table-column
              label="工作项"
              prop="workContent"
              min-width="200px"
            >
            </el-table-column>
            <el-table-column
              label="工时日期"
              prop="weekDateStr"
              min-width="200px"
            >
              <template slot-scope="scope">
                <span>{{ checkDate(scope.row.weekDateStr) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="工时投入(天)"
              prop="weekTime"
              min-width="200px"
            >
            </el-table-column>

            <el-table-column prop="userLevel" label="级别" min-width="180">
              <template slot-scope="scope">
                {{ getName(scope.row.userLevel, levelList) }}
              </template>
            </el-table-column>

            <el-table-column prop="userPost" label="职能" min-width="180">
              <template slot-scope="scope">
                {{ getName(scope.row.userPost, funcList) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="userCompany"
              label="所属公司"
              min-width="180"
            >
              <template slot-scope="scope">
                {{ getName(scope.row.userCompany, companyList) }}
              </template>
            </el-table-column>

            <el-table-column prop="submitTime" label="提交时间" min-width="180">
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <div class="footer-panel">
      <span
        >已选择<em>{{ totalMoney.len }}</em
        >条</span
      >
      <span
        >工时<em>{{ totalMoney.hours }}</em
        >天</span
      >
      <el-button
        type="primary"
        @click="alertSelectAll"
        class="tl-btn amt-bg-slip"
        >批量调配</el-button
      >
    </div>

    <tl-hours-list ref="HoursList" @submit="submit"></tl-hours-list>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import crcloudTable from '@/components/crcloudTable';
import HoursList from './HoursList';
import Server from '../../server';
import CONST from '../../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      userId: '',
      baseInfo: {},
      options: [],
      weekBegin: '',
      startTime: '',
      checkItem: {},
      CONST,
      projectCost: {},
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showApproval: false,
      showApprovalDetail: false,
      tableData: [],
      checkList: [],
      showPop: false,
      projectList: [],
      formData: {
        projectId: '',
        approvalStatus: '',
      },
      projectBudgetAmount: 0,
      projectBudgetCurrency: '',
      projectConfirmAmount: 0,
      projectConfirmCurrency: '',
      workList: [],
      listDis: [],
      projectInfoList: [],
      projectInfo: {},
      totalMoney: {
        len: 0,
        hours: 0,
      },
      levelList: [],
      companyList: [],
      funcList: [],
      selection: [],
      weekLine: '',
      beginWeekDate: '',
      endWeekDate: '',
      submitInfo: {},
      treeData: [],
      orgId: '',
    };
  },

  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-hours-list': HoursList,
  },
  props: {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.getOrgTree();
    this.server.allocate({
      projectId: this.$route.query.projectId,
    }).then((res) => {
      if (res.code == '200') {
        this.projectList = res.data;
        if (this.projectList.length > 0) {
        //  this.formData.projectId = this.projectList[0].projectId;
          const list = this.projectList.filter((item) => Number(item.projectCount) > 0);
          console.log(list);
          if (list.length > 0) {
            this.formData.projectId = list[0].projectId;
          } else {
            this.formData.projectId = this.projectList[0].projectId;
          }
        }
        this.getCode();
        this.searchList();
        this.projectDetailJoin();
        this.queryProjectCostUsed();
      }
    });
  },
  methods: {
    back() {
      this.$router.push({ name: 'mainHours', query: { projectId: this.$route.query.projectId } });
    },
    changeOrg() {
    //  console.log(this.$refs.cascader);
      this.$refs.cascader.dropDownVisible = false;
      this.searchList();
    },
    getOrgTree() {
      this.server.getOrg({}).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        }
      });
    },
    queryProjectCostUsed() {
      this.server.queryProjectCostUsed({
        projectId: this.formData.projectId,
      }).then((res) => {
        this.projectCost = res.data;
      });
    },
    changeProject() {
      this.searchList();
      this.projectDetailJoin();
      this.queryProjectCostUsed();
    },
    unique(arr) {
      // Set数据结构，它类似于数组，其成员的值都是唯一的
      return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
    },
    checkDate(time) {
      const arrTime = time.split(',');
      const list = arrTime.map((item) => this.dateFormat('mm月dd日', item));
      return this.unique(list).join(',');
    },
    getCode() {
      this.server.queryByCodes({
        codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
      }).then((res) => {
        if (res.code == '200') {
          this.codes = res.data;
          this.codes.forEach((item) => {
            switch (item.code) {
              case 'PROJECT_EMPLOYEE_LEVEL':
                this.levelList = item.subList;
                break;
              case 'PROJECT_TECH_TYPE':
                this.funcList = item.subList;
                break;
              case 'PROJECT_EMPLOYEE_COMPANY':
                this.companyList = item.subList;
                break;
              default:
                break;
            }
          });
        }
      });
    },
    getName(code, arr) {
      let name = arr.filter((item) => item.value == code);
      if (name.length == 0) {
        name = [{ meaning: '' }];
      }
      return name[0].meaning;
    },
    selectUser(selection) {
      this.selection = selection;
      let hours = 0;
      selection.forEach((item) => {
        hours += item.weekTime;
      });
      this.totalMoney = {
        len: selection.length,
        hours,
      };
    },
    alertSelectAll() {
      if (this.selection.length == 0) {
        this.$message.success('请勾选调入工时');
        return false;
      }
      this.userCostSummary();
    },
    submit() {
      const params = {
        currentProjectId: this.$route.query.projectId,
        projectId: this.formData.projectId,
        allocateWorkDetailVoList: this.selection,
        extendCostAmt: this.submitInfo.extendCost,
        innerCostAmt: this.submitInfo.innerCost,
        costAmt: this.submitInfo.extendCost + this.submitInfo.innerCost,
        weekTimeCount: this.submitInfo.weekTimeCount,
        userCount: this.submitInfo.userCount,
      };
      this.server.submitAllocateUserWork(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('调配完成');
          this.$refs.table.clearSelection();
          this.selection = [];
          this.searchList();
        }
      });
    },
    searchList() {
      if (this.weekLine) {
      // eslint-disable-next-line prefer-destructuring
        this.beginWeekDate = this.weekLine[0];
        // eslint-disable-next-line prefer-destructuring
        this.endWeekDate = this.weekLine[1];
      } else {
        this.endWeekDate = '';
        this.beginWeekDate = '';
      }
      const params = {
        currentProjectId: this.$route.query.projectId,
        projectId: this.formData.projectId,
        keyWord: this.keyWord,
        orgId: this.orgId,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        beginWeekDate: this.beginWeekDate,
        endWeekDate: this.endWeekDate,
      };
      this.server.projectUserDetailWork(params).then((res) => {
        this.tableData = res.data.content;
        this.total = res.data.total;
      });
    },
    projectDetailJoin() {
      this.server.projectDetailJoin({ projectId: this.formData.projectId }).then((res) => {
        this.projectInfo = res.data;
      });
    },
    userCostSummary() {
      this.server.userCostSummary({
        projectId: this.formData.projectId,
        currentProjectId: this.$route.query.projectId,
        allocateWorkDetailVoList: this.selection,
      }).then((res) => {
        console.log(res);
        res.data.projectNameCn = this.projectInfo.projectNameCn;
        this.submitInfo = res.data;
        this.$refs.HoursList.show(this.selection, res.data);
      });
    },
  },

};
</script>