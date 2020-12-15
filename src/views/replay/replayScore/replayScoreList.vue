<template>
  <div class="replay-list">
    <div class="operating-box">
      <dl class="dl-item">
        <dt>周期</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="请选择目标周期"
            :popper-append-to-body="false"
            @change="okrReviewList"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>
      <dl class="dl-item">
        <dt>组织</dt>
        <dd>
          <el-cascader
            v-model="orgFullIdList"
            ref="cascader"
            :options="departmentData"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              value: 'orgId',
              label: 'orgName',
              children: 'children',
            }"
            @change="selectIdChange"
            popper-class="tl-cascader-popper"
            class="tl-cascader"
          ></el-cascader>
        </dd>
      </dl>
      <dl class="dl-item">
        <dt>复核状态</dt>
        <el-select
          v-model.trim="checkStatus"
          placeholder="全部"
          :popper-append-to-body="false"
          @change="okrReviewList"
          clearable
          popper-class="tl-select-dropdown"
          class="tl-select"
        >
          <el-option
            :label="item.name"
            :value="item.status"
            v-for="(item, index) in CONST.REPLAY_STATUS_LIST"
            :key="index"
          ></el-option>
        </el-select>
      </dl>
      <el-button plain class="tl-btn light" @click="okrReviewList"
        >搜索</el-button
      >
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="okrReviewList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="orgFullName" label="部门" min-width="120">
            </el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column
              prop="periodName"
              label="OKR周期"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="reviewStatusCn"
              label="复核状态"
            ></el-table-column>
            <el-table-column prop="okrProgress" label="OKR进度" min-width="180">
              <template slot-scope="scope">
                <tl-process
                  :data="scope.row.okrProgress"
                ></tl-process> </template
            ></el-table-column>
            <el-table-column prop="selfAssessmentScore" label="OKR得分">
              <template slot-scope="scope">
                <span v-if="scope.row.selfAssessmentScore != null">{{
                  scope.row.selfAssessmentScore
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="finalScore" label="复核得分">
              <template slot-scope="scope">
                <span v-if="scope.row.finalScore != null">{{
                  scope.row.finalScore
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column width="80" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="tl-btn"
                  v-if="scope.row.reviewStatus == 3"
                  @click="
                    $router.push({
                      name: 'replayScoreDetail',
                      query: {
                        okrId: scope.row.okrId,
                      },
                    })
                  "
                >
                  复核得分
                </el-button>
                <el-button
                  v-else
                  type="text"
                  class="tl-btn"
                  @click="
                    $router.push({
                      name: 'replayScoreDetail',
                      query: {
                        okrId: scope.row.okrId,
                        isdetail: true,
                      },
                    })
                  "
                >
                  详情
                </el-button>
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
import process from '@/components/process';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'replayScoreList',
  data() {
    return {
      CONST,
      server,
      tableData: [],
      pageSize: 20,
      totalpage: 0,
      currentPage: 1,
      periodIdList: [],
      orgFullIdList: [],
      departmentData: [],
      periodId: '',
      checkStatus: '',
      orgId: '',
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-process': process,
  },
  created() {
    this.getOkrCycleList();
    this.getOrgTable();
  },
  methods: {
    okrReviewList() {
      sessionStorage.setItem('historyPer', this.periodId);
      this.server.getOkrCheckPage({
        periodId: this.periodId, // 周期id，必传
        reviewStatus: this.reviewStatus, // 复盘状态 1、待复盘，2、待沟通，3、复盘结束;<不传参数，则表示查询全部>
        userName: this.userName, // 支持精确搜索
        currentPage: this.currentPage, // 可以不传，默认是1
        pageSize: this.pageSize, // 可以不传，默认是20
        checkStatus: this.checkStatus,
        orgId: this.orgId,
      }).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
      });
    },
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;
        if (sessionStorage.getItem('historyPer')) {
          this.periodId = sessionStorage.getItem('historyPer');
        } else {
          this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
        }

        this.okrReviewList();
      });
    },
    // 查询组织树
    getOrgTable() {
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData = [];
            this.departmentData.push(res.data);
            if (this.departmentData.length > 0) {
              this.replaceName(this.departmentData[0]);
            }
            // 默认取第二层润联科技
            this.orgFullId = this.departmentData[0].orgFullId;
            this.orgId = this.departmentData[0].orgId;
            this.orgFullIdList = this.orgFullId.split(':');
            this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.getOrgName(this.departmentData, 0);
            this.okrReviewList();
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
            this.test = item.orgName;
          }
        }
      });
    },
    selectIdChange(data) {
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      this.$refs.cascader.dropDownVisible = false;
      this.getOrgName(this.departmentData, 0);
      this.orgId = data[data.length - 1];
      this.okrReviewList();
    },
  },
};
</script>

<style>
</style>