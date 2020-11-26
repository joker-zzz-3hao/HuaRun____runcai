<template>
  <div class="working-hours">
    <div class="operating-area">
      <div class="page-title">工时审批</div>
      <div class="operating-box">
        <dl class="dl-item">
          <dt>项目</dt>
          <dd>
            <el-select
              v-model="formData.projectId"
              :popper-append-to-body="false"
              placeholder="请选择项目"
              @change="changeProject"
              popper-class="tl-select-dropdown"
              class="tl-select project-select"
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
        <dl class="dl-item">
          <dt>审批状态</dt>
          <dd>
            <el-select
              v-model="formData.approvalStatus"
              :popper-append-to-body="false"
              placeholder="请选择审批状态"
              @change="changeStatus"
              clearable
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="(item, index) in CONST.APPROVAL_STATUS_LIST"
                :key="index + item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </dd>
        </dl>
      </div>
    </div>
    <div class="cont-area">
      <div class="dl-list">
        <dl class="dl-item">
          <dt><span>项目总预算</span></dt>
          <dd>
            <em v-money="{ value: projectBudgetAmount, precision: 2 }"></em
            ><span>元</span><span>{{ projectBudgetCurrency || "人民币" }}</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目已确认人力成本</span></dt>
          <dd>
            <em v-money="{ value: projectConfirmAmount, precision: 2 }"></em
            ><span>元</span
            ><span>{{ projectConfirmCurrency || "人民币" }}</span>
          </dd>
        </dl>
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
            @select="selectList"
            @select-all="selectList"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="工作项" prop="workContent">
            </el-table-column>
            <el-table-column label="工作项内容" min-width="110" prop="workDesc">
            </el-table-column>
            <el-table-column label="进度" min-width="110" prop="workProgress">
            </el-table-column>
            <el-table-column prop="applyTime" label="提交人" min-width="180">
              <template slot-scope="scope">
                <div class="user-info">
                  <img
                    v-if="hasValue(scope.row.headUrl)"
                    :src="scope.row.headUrl"
                    alt
                  />
                  <div v-else-if="scope.row.userName" class="user-name">
                    <em>{{
                      scope.row.userName.substring(
                        scope.row.userName.length - 2
                      )
                    }}</em>
                  </div>
                </div>
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="周期时间"> </el-table-column>
            <el-table-column label="投入工时" min-width="200px">
              <template slot-scope="scope">
                <div v-if="scope.row.approvalStatus == '0'">
                  <div>
                    <em>{{ scope.row.weekWorkList.length * 0.5 }}天 </em>
                    <el-popover
                      placement="top"
                      width="300"
                      :key="scope.$index + scope.row.projectId"
                      trigger="click"
                      :tabindex="scope.$index"
                      :ref="'popover' + scope.$index"
                      popper-class="approval-pop"
                      @show="
                        listTimeFun(
                          scope.row.arr,
                          scope.row.userId,
                          scope.row.weekBegin
                        )
                      "
                    >
                      <div v-for="(item, index) in monDayList" :key="index">
                        <dt>{{ item }}</dt>
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox :label="item + '上午'">上午</el-checkbox>
                          <el-checkbox :label="item + '下午'">下午</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <!-- <div>
                        <dt>周二</dt>
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox label="周二上午">上午</el-checkbox>
                          <el-checkbox label="周二下午">下午</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div>
                        <dt>周三</dt>
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox label="周三上午">上午</el-checkbox>
                          <el-checkbox label="周三下午">下午</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div>
                        <dt>周四</dt>
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox label="周四上午">上午</el-checkbox>
                          <el-checkbox label="周四下午">下午</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div>
                        <dt>周五</dt>
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox label="周五上午">上午</el-checkbox>
                          <el-checkbox label="周五下午">下午</el-checkbox>
                        </el-checkbox-group>
                      </div> -->
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入修改原因"
                        class="tl-textarea"
                      >
                      </el-input>
                      <div class="flex-end">
                        <el-button
                          type="primary"
                          class="tl-btn amt-bg-slip"
                          @click="
                            confirmTimeSheet(
                              scope.$index,
                              scope.row.arr,
                              scope.row.weekBegin
                            )
                          "
                          >确定</el-button
                        >
                      </div>
                      <el-button type="text" slot="reference">修改</el-button>
                    </el-popover>
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="changeListDate(scope.row.arr)"
                    placement="top"
                  >
                    <div>{{ changeListDate(scope.row.arr) }}</div>
                  </el-tooltip>
                </div>
                <div v-else>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      checkOldNew(scope.row.weekBegin, scope.row.weekWorkList)
                        .showOld
                    "
                    placement="top"
                  >
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                  <div>
                    {{
                      checkOldNew(scope.row.weekBegin, scope.row.weekWorkList)
                        .showNew
                    }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="projectNameCn"
              label="项目名称"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectNameCn)">{{
                  scope.row.projectNameCn
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="approvalStatus"
              label="审批状态"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalStatus)">
                  <i
                    :class="{
                      'el-icon-basketball': scope.row.approvalStatus == '0',
                      'el-icon-basketball': scope.row.approvalStatus == '1',
                    }"
                  ></i>
                  {{
                    CONST.APPROVAL_STATUS_MAP[scope.row.approvalStatus]
                  }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="submitTime" label="提交日期" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.submitTime)">{{
                  scope.row.submitTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalTime"
              label="审批日期"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalTime)">{{
                  scope.row.approvalTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalUserName"
              label="审批人"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalUserName)">{{
                  scope.row.approvalUserName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              v-if="tableData.length > 0"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.approvalStatus == '0'"
                  @click="alertSelect(scope.row)"
                  type="text"
                  class="tl-btn"
                  >确认审批</el-button
                >
                <el-button
                  v-if="scope.row.approvalStatus == '1'"
                  type="text"
                  class="tl-btn"
                  >已审批</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="alertSelectAll">批量审批</el-button>
        </div>
      </tl-crcloud-table>
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import approval from './components/approval';
import approvalDetail from './components/approvalDetail';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      monDayList: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
      ],
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
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
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
          this.formData.projectId = this.projectList[0].projectId;
          this.searchList();
        }
      }
    });
  },
  methods: {
    checkOldNew(weekBegin, list) {
      const arr = [];
      list.forEach((item) => {
        const obj = this.changeTimeText(weekBegin, item.weekDate, item.weekTimeType);
        arr.push({ text: obj.text, weekTimeAfter: item.weekTimeAfter });
      });
      const showNew = arr.filter((item) => item.weekTimeAfter == '2');
      const showOld = arr.filter((item) => item.weekTimeAfter == '1');
      console.log(arr);
      return { showNew: showNew.join(','), showOld: showOld.join(',') };
    },
    selectList(select) {
      this.workList = select.map((item) => ({
        sourceId: item.sourceId,
        weekWorkList: item.checkList,
        weekBegin: item.weekBegin,
        remark: item.remark || 111,
        projectApprovalId: item.projectApprovalId,
      }));
    },
    handleCheckedCitiesChange(val) {
      console.log(val);
    },

    confirmTimeSheet(index) {
      const arr = this.checkList.map((item) => ({ weekDate: item, type: '0' }));
      // eslint-disable-next-line array-callback-return
      this.tableData[index].old.forEach((item) => {
        if (!(arr.some((li) => li.weekDate == item))) {
          arr.push({ weekDate: item, type: '1' });
        } else {
          const indexs = arr.findIndex((li) => li.weekDate == item);
          arr[indexs].type = '2';
        }
      });

      console.log(arr);
      this.tableData[index].arr = this.checkList;
      this.$set(this.tableData[index], arr, this.checkList);
      this.tableData[index].checkList = arr;
      this.$refs[`popover${index}`].doClose();
    },
    alertSelect(row) {
      this.$xconfirm({
        title: '确认审批',
        content: '是否确认审批',
      }).then(() => {
        this.timeSheetListapproval(row.projectApprovalId, row.weekBegin, row.checkList, row.sourceId);
      });
    },
    alertSelectAll() {
      this.$xconfirm({
        title: '确认批量审批',
        content: '是否确认审批',
      }).then(() => {
        this.server.timeSheetListapproval({ workList: this.workList }).then((res) => {
          console.log(res);
        });
      });
    },
    timeSheetListapproval(projectApprovalId, weekBegin, list, sourceId) {
      const params = {};
      params.sourceId = sourceId;
      params.weekWorkList = list;
      params.weekBegin = weekBegin;
      params.remark = '111';
      params.projectApprovalId = projectApprovalId;
      this.server.timeSheetListapproval({ workList: [params] }).then((res) => {
        console.log(res);
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
    selectWeeklyTimeSumByUserId(userId, weekBegin) {
      this.server.selectWeeklyTimeSumByUserId({
        userId,
        weekDate: weekBegin,
      }).then((res) => {
        console.log(res);
      });
    },
    searchList() {
      this.server.timeSheetList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.formData.projectId,
        approvalStatus: this.formData.approvalStatus,
        approvalUser: this.userInfo.userAccount,
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
            item.weekWorkList.forEach((li, i) => {
              const obj = this.changeTimeText(item.weekBegin, li.weekDate, li.weekTimeType);
              arr.push(obj.text);
              this.tableData[index].weekWorkList[i].text = obj.text;
              this.tableData[index].weekWorkList[i].num = 0.5;
            });
            this.tableData[index].old = arr;
            this.tableData[index].arr = arr;
            // eslint-disable-next-line no-shadow
            this.tableData[index].checkList = arr.map((item) => ({ weekDate: item, type: '2' }));
          });
        }
      });
    },
    changeListDate(time) {
      return time.join(',');
    },
    listTimeFun(list, userId, weekBegin) {
      this.checkList = list;
      this.selectWeeklyTimeSumByUserId(userId, weekBegin);
    },
    changeTimeText(weekBegin, weekDate, weekTimeType) {
      const oneDate = 24 * 60 * 60 * 1000;
      const date = new Date(weekDate) - new Date(weekBegin);
      const timePro = (date + oneDate) / oneDate;
      console.log(timePro);
      const mode = weekTimeType == 1 ? 'Mor' : 'Aft';
      // eslint-disable-next-line max-len
      return { day: CONST.DATE_NUM[timePro.toString()] + mode, text: CONST.DATE_MODE[CONST.DATE_NUM[timePro.toString()] + mode] };
    },
    changeProject() {
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
  watch: {},
};
</script>
