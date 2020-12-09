<template>
  <div class="working-hours">
    <div class="operating-area">
      <div class="operating-box-group">
        <div class="operating-box">
          <dl class="dl-item">
            <dt>选择工时</dt>
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

      </div>
    </div>
    <div class="project-info">
    <div class="project-description">
      <dl>
        <dt>

        </dt>
        <dd>
          <span>项目名称:</span>
          <p
            ref="projectDesc"
            id="projectDesc"
            :class="openFlag ? 'unfold' : 'fold'"
          >

          </p>

        </dd>
      </dl>
      <div class="dl-list">
        <dl class="dl-item">
          <dt><span>项目经理</span></dt>
          <dd>

          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目所属部门</span></dt>
          <dd>

          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目总预算</span></dt>
          <dd>

          </dd>
        </dl>

        <dl class="dl-item project-type">
          <dt><span>项目类型</span></dt>
          <dd>

          </dd>
        </dl>
           <dl class="dl-item project-type">
          <dt><span>已用人力成本</span></dt>
          <dd>

          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目时间</span></dt>
          <dd>

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
                @change="changePick"
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
            <dd>
              <el-input
                maxlength="64"
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
    <div class="cont-area">

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
            @select="selectList"
            @select-all="selectList"
            row-key="sourceId"
          >
          <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column prop="applyTime" label="提交人" min-width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" min-width="200px">
            </el-table-column>
               <el-table-column label="工作项" min-width="200px">
            </el-table-column>
            <el-table-column label="工时投入(天)" min-width="200px">

            </el-table-column>

           <el-table-column
              prop="projectNameCn"
              label="级别"
              min-width="180"
            >

            </el-table-column>

           <el-table-column
              prop="projectNameCn"
              label="职能"
              min-width="180"
            >

            </el-table-column>

           <el-table-column
              prop="projectNameCn"
              label="所属公司"
              min-width="180"
            >
                </el-table-column>

             <el-table-column
              prop="projectNameCn"
              label="部门"
              min-width="180"
            >
                </el-table-column>

             <el-table-column
              prop="projectNameCn"
              label="提交时间"
              min-width="180"
            >

            </el-table-column>

          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <div class="footer-panel">
      <span
        >已选择<em>{{ workList.length }}</em
        >位成员</span
      >
      <el-button
        type="primary"
        @click="alertSelectAll"
        class="tl-btn amt-bg-slip"
        >批量审批</el-button
      >
    </div>
    <tl-approval
      ref="approval"
      v-if="showApproval"
      :server="server"
      @success="approvalSuccess"
    ></tl-approval>
    <tl-approval-detail
      ref="approvalDetail"
      v-if="showApprovalDetail"
      :server="server"
    ></tl-approval-detail>
    <tl-hours-list ref="HoursList"></tl-hours-list>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import crcloudTable from '@/components/crcloudTable';
import HoursList from './HoursList';
import approval from './approval';
import approvalDetail from './approvalDetail';
import Server from '../../server';
import CONST from '../../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      weekLine: [],
      userId: '',
      monDayList: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周日',
      ],
      baseInfo: {},
      options: [],
      weekBegin: '',
      startTime: '',
      checkItem: {},
      CONST,
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showApproval: false,
      showApprovalDetail: false,
      tableData: [],
      textMay: [],
      timeMay: [],
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
    };
  },

  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
    'tl-hours-list': HoursList,
  },
  props: {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.server.projectPageList({
      currentPage: 1,
      pageSize: 9999,
      projectName: '',
      userAccount: this.userInfo.userAccount,
    }).then((res) => {
      if (res.code == '200') {
        this.projectList = res.data.content;
        if (this.projectList.length > 0) {
        //  this.formData.projectId = this.projectList[0].projectId;
          const list = this.projectList.filter((item) => Number(item.projectCount) > 0);
          console.log(list);
          if (list.length > 0) {
            this.formData.projectId = list[0].projectId;
          } else {
            this.formData.projectId = this.projectList[0].projectId;
          }

          this.summaryList();
          this.searchList();
        }
      }
    });
  },
  methods: {
    GetLength(text) {
      if (this.getBLen(text) >= 46) {
        const str = JSON.parse(JSON.stringify(text));
        return `${str.substring(0, 46)}...`;
      }
      return text;
    },

    getBLen(str) {
      if (str == null) return 0;
      if (typeof str != 'string') {
        str += '';
      }
      // eslint-disable-next-line no-control-regex
      return str.replace(/[^\x00-\xff]/g, '01').length;
    },
    summaryList() {
      this.server.summaryList({ projectId: this.formData.projectId }).then((res) => {
        if (res.code == 200) {
          this.options = res.data;
        }
      });
    },
    changePick() {
      this.searchList();
    },
    weekWorkListCheck(row) {
      const listFiler = row.weekWorkList.filter((item) => item.weekTimeAfter != '0');
      const list = listFiler.map((item) => `${item.weekDate.split('-')[1]}月${item.weekDate.split('-')[2]}日`);
      const checkList = [...new Set(list)];
      return checkList.join(',');
    },
    getMonthWeek(dateTime) {
      const timeArr = dateTime.split('-');
      const a = timeArr[0];
      const b = timeArr[1];
      const c = timeArr[2];
      // eslint-disable-next-line radix
      const date = new Date(a, parseInt(b) - 1, c);
      let w = date.getDay();
      const d = date.getDate();
      if (w == 0) {
        w = 7;
      }
      const config = {
        getMonth: date.getMonth() + 1,
        getYear: date.getFullYear(),
        getWeek: Math.ceil((d + 6 - w) / 7),
      };

      return `${config.getMonth}月${config.getWeek}周`;
    },
    checkOldNew(row) {
      const { weekBegin } = row;
      const list = row.weekWorkList;
      const arr = [];
      list.forEach((item) => {
        const obj = this.changeTimeText(weekBegin, item.weekDate, item.weekTimeType);
        arr.push({ text: obj.text, weekTimeAfter: item.weekTimeAfter, weekTimeFront: item.weekTimeFront });
      });
      const showNew = arr.filter((item) => item.weekTimeAfter != '0');
      const showOld = arr.filter((item) => item.weekTimeFront == '1');
      const showNewText = showNew.map((item) => item.text);
      const showOldText = showOld.map((item) => item.text);
      let bool = true;
      // eslint-disable-next-line no-unused-vars
      let oldNew;
      if (this.scalarArrayEquals(showNewText, showOldText)) {
        bool = false;
        oldNew = showOldText;
      } else {
        bool = true;
        oldNew = [...showOldText];
      }

      return {
        showNewText: this.totalDate(showNewText).join(','),
        showOldText: this.totalDate(showOldText).join(','),
        day: showNewText.length * 0.5,
        show: bool,
      };
    },
    selectList(select) {
      this.workList = select.map((item) => ({
        sourceId: item.sourceId,
        projectApprovalId: item.projectApprovalId,
        weekSum: item.weekSum,
        weekWorkList: item.checkList,
        weekBegin: item.weekBegin,
        remark: '',
      }));
    },
    getTypeTm(li) {
      const list = CONST.DATE_MODE_NUMOBJ.filter((item) => li == item.value);
      console.log(list);
      return { weekDate: list[0].weekDate, weekTimeType: list[0].weekTimeType };
    },

    confirmTimeSheet(index, scope) {
      const arr = this.checkList.map((item) => ({ weekDate: item, type: '0', weekTimeFront: '' }));
      console.log(arr);
      // eslint-disable-next-line array-callback-return
      this.tableData[index].old.forEach((item) => {
        const eq = arr.findIndex((k) => k.weekDate == item.text);
        if (eq >= 0) {
          arr[eq].weekTimeFront = item.weekTimeFront || '';
        }
        if (!(arr.some((li) => li.weekDate == item.text))) {
          arr.push({ weekDate: item.text, type: '1', weekTimeFront: item.weekTimeFront });
        } else {
          const indexs = arr.findIndex((li) => li.weekDate == item.text);
          arr[indexs].type = '2';
        }
      });

      // eslint-disable-next-line max-len
      const arrgo = arr.map((item) => ({
        // eslint-disable-next-line max-len
        weekDate: this.getTypeTm(item.weekDate).weekDate, type: item.type, weekTimeType: this.getTypeTm(item.weekDate).weekTimeType, weekTimeFront: item.weekTimeFront,
      }));
      console.log(arrgo);

      // if (arrgo.some((item) => item.type == '0' || item.type == '1')) {

      //  }

      // eslint-disable-next-line max-len
      // } else if (arrgo.every((item) => item.type == '3' || (item.type == '1' && item.weekTimeFront == '0')) && this.tableData[index].remark) {
      //   this.$message.error('当前未修改工作项，不需要写修改原因');
      //   return false;
      // }
      // this.tableData[index].arrgo = this.checkList;
      this.$set(this.tableData[index], arrgo, this.checkList);
      this.tableData[index].checkList = arrgo;
      this.timeSheetListapproval(this.tableData[index]);
      scope._self.$refs[`popover-${index}`].doClose();
    },
    close(scope) {
      console.log(scope._self);
      scope._self.$refs[`popover-${scope.$index}`].doClose();
    },
    // 组合全天
    totalDate(dateArr) {
      this.monDayList.forEach((li) => {
        const one = dateArr.some((item) => item == `${li}上午`);
        const tow = dateArr.some((item) => item == `${li}下午`);
        if (one && tow) {
          dateArr.remove(`${li}上午`);
          dateArr.remove(`${li}下午`);
          dateArr.push(`${li}全天`);
        }
      });
      this.$forceUpdate();
      return dateArr;
    },
    alertSelect(scope, desc) {
      console.log(this.tableData[scope.$index]);
      if (desc) {
        if (!this.tableData[scope.$index].remark) {
          this.$message.error('修改理由不能为空');
          return false;
        }
      }

      this.$xconfirm({
        title: '确认审批',
        content: '工时确认后将不可再修改, 请确认',
      }).then(() => {
        if (desc) {
          this.confirmTimeSheet(scope.$index, scope);
        } else {
          this.tableData[scope.$index].remark = '';
          this.timeSheetListapproval(scope.row);
        }
      });
    },
    alertSelectAll() {
      this.$refs.HoursList.show();
    },
    updateTimeWeek(row) {
      const {
        projectApprovalId, weekBegin, checkList, sourceId, remark,
      } = row;
      const params = {};
      params.sourceId = sourceId;
      params.weekWorkList = checkList;
      params.weekBegin = weekBegin;
      params.remark = remark;
      params.projectApprovalId = projectApprovalId;
      this.server.updateTimeWeek(params).then((res) => {
        if (res.code == '200') {
          this.$message.success('修改成功');
          this.searchList();
        }
      });
    },
    timeSheetListapproval(row) {
      const {
        projectApprovalId, sourceId,
      } = row;
      const params = {};
      params.sourceId = sourceId;
      params.projectApprovalId = projectApprovalId;
      params.weekSum = row.weekSum;
      params.weekBegin = row.weekBegin;
      params.weekWorkList = row.checkList;
      params.remark = row.remark;
      this.server.timeSheetListapproval({ workList: [params] }).then((res) => {
        if (res.code == '200') {
          this.$message.success('审批成功');
          this.searchList();
        }
      });
    },
    changTextTime() {
      // const date = new Date(time).getDay();
    },
    fdeWeightTwo(arr1, arr2) {
      const list = [];
      // console.log(arr1);
      // console.log(arr2);
      arr2.forEach((a) => {
        const bool = arr1.some((item) => ((item.text == a.text)));

        // eslint-disable-next-line no-unused-expressions
        bool ? list.push({ ...a, type: 1 }) : list.push({ ...a, type: 0 });
        // eslint-disable-next-line array-callback-return
        const index = arr1.findIndex((item) => {
          // eslint-disable-next-line no-unused-expressions
          (item.text == a.text);
        });

        arr1.splice(index, 1);
      });
      return [...list, ...arr1];
    },
    selectWeeklyTimeSumByUserId(userId, weekBegin, index) {
      this.server.selectWeeklyTimeSumByUserId({
        userId,
        weekDate: weekBegin,
      }).then((res) => {
        const arr = res.data.filter((item) => item.weekTimeAfter != 0);
        // eslint-disable-next-line no-shadow
        const listDis = [];
        arr.forEach((item) => {
          const obj = this.changeTimeText(weekBegin, item.weekDate, item.weekTimeType);
          listDis.push(obj.text);
        });

        const setArr = JSON.parse(JSON.stringify(listDis));
        listDis.forEach((item) => {
          const bool = this.tableData[index].old.some((li) => li.text == item);

          if (bool) {
            setArr.remove(item);
          }
        });

        this.listDis = setArr;
        this.listDis.forEach((item) => {
          this.$set(this.checkItem, item, true);
        });
      });
    },
    scalarArrayEquals(array1, array2) {
      return array1.length == array2.length && array1.every((v, i) => v === array2[i]);
    },
    searchList() {
      console.log(this.$refs.picker);
      let weekBegin;
      let weekEnd;
      if (this.weekLine) {
        // eslint-disable-next-line no-unused-vars

        weekBegin = this.weekLine[0] || '';
        weekEnd = this.weekLine[1] || '';
      } else {
        weekBegin = '';
        weekEnd = '';
      }

      this.server.timeSheetList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.formData.projectId,
        approvalStatus: this.formData.approvalStatus,
        approvalUser: this.userInfo.userAccount,
        weekBegin,
        startTime: this.startTime,
        userId: this.userId,
        weekEnd,
        keyWord: this.keyWord,
      }).then((res) => {
        if (res.code == '200') {
          this.projectBudgetAmount = res.data.projectBudgetAmount || 0;
          this.projectBudgetCurrency = res.data.projectBudgetCurrency;
          this.projectConfirmAmount = res.data.projectConfirmAmount || 0;
          this.projectConfirmCurrency = res.data.projectConfirmCurrency;
          this.tableData = res.data.resultPageDto.content;
          this.total = res.data.resultPageDto.total;
          this.tableData.forEach((item, index) => {
            const arr = [];
            const arrOld = [];
            const arrHide = [];
            const arrDev = [];
            item.weekWorkList.forEach((li, i) => {
              const obj = this.changeTimeText(item.weekBegin, li.weekDate, li.weekTimeType);

              if (li.weekTimeAfter != '0') {
                arrHide.push(obj.text);
                arr.push(obj.text);
                arrDev.push({ text: obj.text, weekTimeFront: li.weekTimeFront });
              }

              this.tableData[index].weekWorkList[i].text = obj.text;
              this.tableData[index].weekWorkList[i].num = 0.5;
              //  if (li.weekTimeFront == 1) {
              arrOld.push({ text: obj.text, weekTimeFront: li.weekTimeFront, weekTimeType: li.weekTimeType });
            //  }
            });
            this.tableData[index].old = arrOld;
            this.tableData[index].arr = arr;
            this.tableData[index].arrHide = arrHide;
            this.tableData[index].weekSum = this.tableData[index].weekWorkList.filter((li) => li.weekTimeFront == '1').length;
            // eslint-disable-next-line no-shadow
            this.tableData[index].checkList = arrDev.map((item) => ({ weekDate: this.getTypeTm(item.text).weekDate, type: '2', weekTimeFront: item.weekTimeFront }));
            console.log(this.tableData);
          });
        }
      });
    },
    changeListDate(time) {
      const arr = JSON.parse(JSON.stringify(time));
      return this.totalDate(arr).join(',');
    },
    listTimeFun(list, userId, weekBegin, ldapType, index) {
    //  this.monDayList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      this.$set(this, 'monDayList', ['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
      if (ldapType == 'OTHER') {
        this.$set(this, 'monDayList', ['周一', '周二', '周三', '周四', '周五']);
      } else {
        this.$set(this, 'monDayList', ['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
      }
      this.checkList = JSON.parse(JSON.stringify(list));
      this.checkItem = {};

      this.selectWeeklyTimeSumByUserId(userId, weekBegin, index);
    },
    changeTimeText(weekBegin, weekDate, weekTimeType) {
      const oneDate = 24 * 60 * 60 * 1000;
      const date = new Date(weekDate) - new Date(weekBegin);
      const timePro = (date + oneDate) / oneDate;
      const mode = weekTimeType == 1 ? 'Mor' : 'Aft';
      // eslint-disable-next-line max-len
      return { day: CONST.DATE_NUM[timePro.toString()] + mode, text: CONST.DATE_MODE[CONST.DATE_NUM[timePro.toString()] + mode] };
    },
    async calendarqurey(date) {
      const res = await this.server.calendarqurey({ date });
      const nowDate = new Date(date).getTime();
      // eslint-disable-next-line max-len
      const index = res.data.findIndex((item) => nowDate > new Date(item.weekBegin).getTime() && nowDate < (new Date(item.weekEnd).getTime() + 24 * 60 * 60 * 1000));
      return `${new Date(date).getMonth()}月${index}周`;
    },
    changeProject() {
      this.userId = '';
      this.summaryList();
      this.searchList();
    },
    changeStatus(data) {
      console.log(data);
      this.searchList();
    },
    approval(data) {
      this.showApproval = true;
      this.$nextTick(() => {
        this.$refs.approval.show(data);
      });
    },
    detail(data) {
      this.showApprovalDetail = true;
      this.$nextTick(() => {
        this.$refs.approvalDetail.show(data);
      });
    },
    approvalSuccess() {
      this.showApproval = false;
      this.searchList();
    },
  },
};
</script>