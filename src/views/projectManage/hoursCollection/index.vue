<template>
  <div class="working-hours-collection">
    <div class="cont-area">
      <div class="project-description">
        <dl>
          <dt>
            <span
              :class="{
                'is-ongoing': baseInfo.projectStatus == '0',
                'is-over': baseInfo.projectStatus == '1',
              }"
              >{{ CONST.PROJECT_STATUS_MAP[baseInfo.projectStatus] }}</span
            >
            <em>{{ projectInfo.projectNameCn }}</em>
            <a
              @click="
                $router.push({
                  name: 'queryHistory',
                  query: { projectId: $route.query.projectId },
                })
              "
              >工时补录记录>></a
            >
            <el-button
              plain
              @click="$router.back()"
              class="tl-btn amt-border-slip"
            >
              返回
              <span class="lines"></span>
            </el-button>
          </dt>
        </dl>
        <div class="dl-list">
          <dl class="dl-item">
            <dt><span>内部顾问预算</span></dt>
            <dd>
              <em
                v-money="{ value: projectInfo.insideBudget, precision: 2 }"
              ></em
              ><span>元</span
              ><span>({{ projectInfo.currency || "人民币" }})</span>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>外部顾问预算</span></dt>
            <dd>
              <em
                v-money="{
                  value: projectInfo.outerConsultBudget,
                  precision: 2,
                }"
              ></em
              ><span>元</span
              ><span>({{ projectInfo.currency || "人民币" }})</span>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>项目已确立人力成本</span></dt>
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
            </dd>
          </dl>

          <dl class="dl-item">
            <dt><span>项目经理</span></dt>
            <dd>
              <em>{{ projectInfo.projectManager || "--" }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>项目时间</span></dt>
            <dd>
              <em>{{ projectInfo.projectBeginDate || "--" }}</em
              ><span> 至 </span
              ><em>{{ projectInfo.projectEndDate || "--" }}</em>
            </dd>
          </dl>
        </div>
      </div>
      <div class="dl-card-panel project-members">
        <dt class="card-title">
          <em>项目成员</em>
        </dt>
        <tl-crcloud-table
          :total="total"
          :currentPage.sync="currentPage"
          :pageSize.sync="pageSize"
          @searchList="searchList"
        >
          <div slot="tableContainer" class="table-container">
            <el-table
              :data="tableData"
              class="tl-table"
              ref="table"
              row-key="key"
              @select="selectUser"
              @select-all="selectUser"
              @selection-change="selectUser"
            >
              <el-table-column
                reserve-selection
                type="selection"
                column-key="index"
                width="40"
              >
              </el-table-column>
              <el-table-column prop="userName" label="姓名" min-width="110">
                <template slot-scope="scope">
                  <el-input
                    placeholder="姓名"
                    v-if="!scope.row.userId"
                    @input="checkNull(scope.row)"
                    v-model="scope.row.userName"
                  ></el-input>
                  <span v-else>{{ scope.row.userName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="级别" prop="userLevel" min-width="100">
                <template slot-scope="scope">
                  <el-select
                    @change="selectLevel(scope.row)"
                    v-if="!scope.row.userId"
                    v-model="scope.row.userLevel"
                    placeholder="级别"
                    popper-class="select-dialog"
                    class="tl-select"
                  >
                    <el-option
                      v-for="item in levelList"
                      :key="item.value"
                      :label="item.meaning"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <span v-else>{{ scope.row.userLevel }}</span>
                </template>
              </el-table-column>
              <el-table-column label="用户类型" min-width="100">
                <template slot-scope="scope">
                  <el-select
                    v-if="!scope.row.userId"
                    v-model="scope.row.belongingType"
                    placeholder="类型"
                    filterable
                    popper-class="select-dialog"
                    class="tl-select"
                  >
                    <el-option
                      v-for="(item, index) in CONST.BELONGINGTYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <span v-else>{{
                    CONST.BELONGINGTYPE_TYPE[scope.row.projectUserType]
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="userPost" label="职能" min-width="120">
                <template slot-scope="scope">
                  <el-select
                    v-if="!scope.row.userId"
                    v-model="scope.row.userPost"
                    placeholder="职能"
                    filterable
                    popper-class="select-dialog"
                    class="tl-select"
                  >
                    <el-option
                      v-for="(item, index) in funcList"
                      :key="index + item.meaning"
                      :label="item.meaning"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <span v-else>{{
                    getName(scope.row.userPost, funcList)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="userCompany"
                label="所属公司"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-select
                    v-if="!scope.row.userId"
                    v-model="scope.row.userCompany"
                    placeholder="公司"
                    popper-class="select-dialog"
                    class="tl-select"
                  >
                    <el-option
                      v-for="item in companyList"
                      :key="item.value"
                      :label="item.meaning"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <span v-else>{{
                    getName(scope.row.userCompany, companyList)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="工时时间范围" min-width="250">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.time"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    @change="changeMinMax(scope.row, scope.$index)"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="补录工时(天)"
                min-width="110"
              >
                <template slot-scope="scope">
                  <el-input-number
                    controls-position="right"
                    v-model="scope.row.supplementTime"
                    :min="0.5"
                    :step="0.5"
                    :step-strictly="true"
                    :max="scope.row.max"
                    @change="selectUserAdd"
                    :disabled="!scope.row.time"
                    :precision="1"
                    class="tl-input-number"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="工时内容"
                min-width="180"
              >
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入内容"
                    @input="checkNull(scope.row)"
                    v-model="scope.row.supplementContent"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.userId"
                    @click="deleteMember(scope.$index, scope.row)"
                    type="text"
                    class="tl-btn"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="flex-jc">
              <el-button plain class="tl-btn" @click="addUser()"
                ><i class="el-icon-plus"></i><em>添加成员</em></el-button
              >
            </div>
          </div>
        </tl-crcloud-table>
      </div>
    </div>
    <div class="footer-panel">
      <span
        >已选择<em>{{ selection.length }}</em
        >位成员，工时<em>{{ hours }}</em
        >天</span
      >

      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="showhoursRecord"
        >确定</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="$router.back()"
        >取消</el-button
      >
    </div>
    <tl-hours-record
      ref="hoursRecord"
      :selection="selection"
      @success="clearSelection"
    ></tl-hours-record>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import hoursRecord from './components/hoursRecord';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'projectInfo',
  data() {
    return {
      CONST,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      server,
      selection: [],
      hours: 0,
      isTalentAdmin: false,
      showAddMember: false,
      checkManager: false,
      funcList: [],
      companyList: [],
      levelList: [],
      tableData: [],
      isManage: false,
      openFlag: false,
      codes: [],
      pWidth: '',
      emWidth: '',
      DisuserId: {},
      checkbool: false,
      projectInfo: {},
      projectCost: {},
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-hours-record': hoursRecord,
  },
  props: {

    baseInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      listenerWidth: (state) => state.listenerWidth,
    }),
  },
  mounted() {
    this.projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
    this.getUserList();
    this.searchList();
    this.queryProjectCostUsed();
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
  methods: {
    queryProjectCostUsed() {
      this.server.queryProjectCostUsed({
        projectId: this.$route.query.projectId,
      }).then((res) => {
        this.projectCost = res.data;
      });
    },
    selectLevel(row) {
      this.checkNull(row);
    },
    selectable(row) {
      console.log(row);
      // eslint-disable-next-line max-len
      return row.checkNull;
    },
    getUserList() {
      this.server.projectUserList({}).then((res) => {
        if (res.code == '200') {
          this.projectManagerList = res.data;
        }
      });
    },
    clearSelection() {
      this.searchList();
      this.queryProjectCostUsed();
      this.$refs.table.clearSelection();
    },
    searchList() {
      this.server.queryProjectUserList({
        projectId: this.$route.query.projectId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableData = res.data.content;
        this.tableData.forEach((item, index) => {
          this.tableData[index].checkNull = false;
          this.tableData[index].key = index;
        });
        console.log(this.tableData);
        this.total = res.data.total;
      });
    },
    getName(code, arr) {
      const name = arr.filter((item) => item.value == code);
      if (name.length == 0) {
        return '';
      }
      return name[0].meaning;
    },
    changeMinMax(row, index) {
      const { time } = row;
      let weekBegin;
      let weekEnd;
      if (time) {
        // eslint-disable-next-line prefer-destructuring
        weekBegin = time[0];
        // eslint-disable-next-line prefer-destructuring
        weekEnd = time[1];

        console.log(time);
        const oneDate = 24 * 60 * 60 * 1000;
        // eslint-disable-next-line no-useless-escape
        const startTime = new Date(weekBegin.split(/[- : \/]/)).getTime();
        // eslint-disable-next-line no-useless-escape
        const endTime = new Date(weekEnd.split(/[- : \/]/)).getTime();
        const cheTime = (endTime - startTime) / oneDate;
        this.tableData[index].max = (cheTime + 1);
        this.tableData[index].supplementTime = 0.5;
      } else {
        this.tableData[index].supplementTime = 0.5;
        this.tableData[index].disabled = true;
      }
    },
    // searchList() {
    //   // this.tableDataRow = this.tableDataRow
    //   const list = this.getPageTable(this.tableDataRow, this.currentPage, this.pageSize);
    //   this.tableData = list.list;
    //   this.total = list.total;
    // },
    showhoursRecord() {
      if (this.selection.length == 0) {
        this.$message.success('请勾选补录工时人员');
        return false;
      }
      console.log(this.selection);
      const check = this.selection.some((item) => !item.userName
       || !item.userPost || !item.userLevel || !item.time || !item.supplementTime || !item.supplementContent);
      if (check) {
        this.$message.success('请填写完整勾选项');
        return false;
      }

      const selection = this.selection.map((item) => ({
        userLevel: item.userLevel,
        userCompany: item.userCompany,
        userPost: item.userPost == 'Project-Mng' ? '' : item.userPost,
        supplementTime: item.supplementTime,
        belongingType: item.belongingType || item.projectUserType,
      }));
      this.server.queryCalculatingMoney({ userList: selection }).then((res) => {
        if (res.code == 200) {
          if (res.data.insideBudget > this.projectInfo.insideBudget) {
            this.$message.error('人力成本超过项目已确立人力成本');
            return false;
          }
          if (res.data.outerConsultBudget > this.projectInfo.outerConsultBudget) {
            this.$message.error('人力成本超过项目已确立人力成本');
            return false;
          }
          if ((res.data.insideBudget + res.data.outerConsultBudget)
          > (this.projectInfo.outerConsultBudget + this.projectInfo.insideBudget)) {
            this.$message.error('人力成本超过项目已确立人力成本');
            return false;
          }
          this.$refs.hoursRecord.show(res.data);
        }
      });
    },
    addUser() {
      this.tableData.push({ key: (new Date()).getTime(), supplementTime: 0.5 });
      this.$refs.table.doLayout();
      this.total += 1;
    },
    deleteMember(index) {
      this.tableData.splice(index, 1);
      // this.$refs.table.toggleRowSelection(row, false);
      this.total -= 1;
      this.selectUserAdd();
    },
    selectUser(selection) {
      this.selection = selection;
      console.log(this.selection);
      let hours = 0;
      selection.forEach((item) => {
        hours += item.supplementTime || 0;
      });
      this.hours = hours;
    },
    selectUserAdd() {
      let hours = 0;
      this.selection.forEach((item) => {
        hours += item.supplementTime || 0;
      });
      this.hours = hours;
    },
  },

};
</script>