<template>
  <div class="project-info">
    <div class="project-description">
      <dl>

          <dt><span>{{projectInfo.projectNameCn}}</span></dt>
           <dd><a @click="$router.push({name:'queryHistory',query:{projectId:$route.query.projectId}})">工时补录记录>></a> </dd>

      </dl>
      <div class="dl-list">

        <dl class="dl-item">
          <dt><span>内部顾问预算</span></dt>
          <dd>
            <em v-money="{ value: projectInfo.insideBudget, precision: 2 }"></em
            ><span>元</span
            ><span>({{ projectInfo.insideBudget || "人民币" }})</span>
          </dd>
        </dl>
         <dl class="dl-item">
          <dt><span>外部顾问预算</span></dt>
          <dd>
            <em v-money="{ value: projectInfo.outerConsultBudget, precision: 2 }"></em
            ><span>元</span
            ><span>({{ projectInfo.outerConsultBudget || "人民币" }})</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目已确立人力成本</span></dt>
          <dd>
            <em v-money="{ value: projectInfo.outerConsultBudget +  projectInfo.insideBudget, precision: 2 }">{{
            }}</em><span>元</span
            ><span>({{ projectInfo.outerConsultBudget || "人民币" }})</span>
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
            ><span> 至 </span><em>{{ projectInfo.projectEndDate || "--" }}</em>
          </dd>
        </dl>
      </div>
    </div>
    <div class="dl-card-panel project-members">
      <dt class="card-title">
        <em>项目成员</em
        >
      </dt>
      <tl-crcloud-table
      :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table" row-key="userId"  @select="selectUser" @select-all="selectUser">
                <el-table-column
                reserve-selection
      type="selection"
      :selectable="selectable"
      width="55">
    </el-table-column>
            <el-table-column prop="userName" label="姓名" min-width="120">
               <template slot-scope="scope">
                   <el-input placeholder="请输入姓名" v-if="!scope.row.userId"
                    @input="checkNull(scope.row)" v-model="scope.row.userName"></el-input>
                    <span v-else>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="级别" prop="userLevel" min-width="100">
               <template slot-scope="scope">
                      <el-select
                        @change="selectLevel(scope.row)"
                      v-if="!scope.row.userId"
                v-model="scope.row.userLevel"
                placeholder="请选择级别"
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
                    <span v-else>{{scope.row.userLevel}}</span>
                    </template>
            </el-table-column>
             <el-table-column prop="userPost" label="职能类型" min-width="90">
                <template slot-scope="scope">
                     <el-select
                       @change="checkNull(scope.row)"
                      v-if="!scope.row.userId"
                v-model="scope.row.belongingType"
                placeholder="请选择"
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
                  <span v-else>{{CONST.BELONGINGTYPE_TYPE[scope.row.projectUserType]}}</span>
                </template>
                      </el-table-column>
            <el-table-column prop="userPost" label="职能" min-width="120">
                 <template slot-scope="scope">
                     <el-select
                       @change="checkNull(scope.row)"
                      v-if="!scope.row.userId"
                v-model="scope.row.userPost"
                placeholder="请选择"
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
                    <span v-else>{{getName(scope.row.userPost,funcList)}}</span>
                    </template>
            </el-table-column>
            <el-table-column prop="userCompany" label="所属公司" min-width="100">
              <template slot-scope="scope">
                      <el-select
                       v-if="!scope.row.userId"
                v-model="scope.row.userCompany"
                @change="checkNull(scope.row)"
                placeholder="请选择所属公司"
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
                    <span v-else>{{getName(scope.row.userCompany,companyList)}}</span>
                    </template>
            </el-table-column>
            <el-table-column prop="time" label="工时时间范围" min-width="250" >
              <template slot-scope="scope">
                   <el-date-picker
                      v-model="scope.row.time"
                      type="daterange"
                      range-separator="至"
                      value-format="yyyy-MM-dd"
                      @change="changeMinMax(scope.row,scope.$index)"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="补录工时(天)" min-width="130">
              <template slot-scope="scope">
                     <el-input-number
                controls-position="right"
                v-model="scope.row.supplementTime"
                :min="0.5"
                :max="scope.row.max"
                :disabled="!scope.row.time"
                :precision="1"
                class="tl-input-number"
              ></el-input-number>
              </template>
            </el-table-column>
   <el-table-column prop="createDate" label="工时内容" min-width="180">
              <template slot-scope="scope">
               <el-input placeholder="请输入内容" @input="checkNull(scope.row)" v-model="scope.row.supplementContent"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"

            >
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.userId"
                  @click="deleteMember(scope.$index)"
                  type="text"
                  class="tl-btn"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="text" @click="addUser()">添加成员</el-button>
        </div>
      </tl-crcloud-table>
    </div>
  <div>

  </div>
      <div class="footer-panel">
   <span>已选择<em>{{selection.length}}</em>位成员，工时<em>{{hours}}</em>天</span>

        <el-button

        type="primary"
        class="tl-btn amt-bg-slip"
        @click="showhoursRecord"
        >确定</el-button
      >
      <el-button
        plain
        class="tl-btn amt-border-fadeout"
        >取消</el-button
      >

    </div>
  <tl-hours-record ref="hoursRecord" :selection="selection"></tl-hours-record>
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
    selectLevel(row) {
      this.checkNull(row);
    },
    selectable(row) {
      console.log(row);
      // eslint-disable-next-line max-len
      return row.checkNull;
    },
    checkNull(row) {
      if (row.userName && row.userPost && row.userLevel && row.supplementTime && row.supplementContent) {
        if (row.projectUserType) {
          row.checkNull = true;
        } else if (row.belongingType) {
          row.checkNull = true;
        } else {
          row.checkNull = false;
        }
      }
    },
    getUserList() {
      this.server.projectUserList({}).then((res) => {
        if (res.code == '200') {
          this.projectManagerList = res.data;
        }
      });
    },
    searchList() {
      this.server.queryProjectUserList({
        projectId: this.$route.query.projectId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableData = res.data.content;
        this.total = res.data.total;
      });
    },
    getName(code, arr) {
      const name = arr.filter((item) => item.value == code);
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
        const startTime = weekBegin.getTime();
        const endTime = weekEnd.getTime();
        const cheTime = (endTime - startTime) / oneDate;
        this.tableData[index].max = cheTime;
        this.tableData[index].supplementTime = '';
      } else {
        this.tableData[index].supplementTime = '';
        this.tableData[index].disabled = true;
      }
      this.checkNull(row);
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
      const selection = this.selection.map((item) => ({
        userLevel: item.userLevel,
        userCompany: item.userCompany,
        userPost: item.userPost == 'Project-Mng' ? '' : item.userPost,
        supplementTime: item.supplementTime,
        belongingType: item.belongingType || item.projectUserType,
      }));
      this.server.queryCalculatingMoney({ userList: selection }).then((res) => {
        if (res.code == 200) {
          this.$refs.hoursRecord.show(res.data);
        }
      });
    },
    addUser() {
      this.tableData.push({});
    },
    deleteMember(index) {
      this.tableData.splice(index, 1);
    },
    selectUser(selection) {
      this.selection = selection;
      console.log(this.selection);
      let hours = 0;
      selection.forEach((item) => {
        hours += item.supplementTime;
      });
      this.hours = hours;
    },
  },

};
</script>