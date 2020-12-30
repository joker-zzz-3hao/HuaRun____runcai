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
            class="tl-select has-bg"
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
            class="tl-cascader has-bg"
          ></el-cascader>
        </dd>
      </dl>
      <dl class="dl-item">
        <dt>绩效复核状态</dt>
        <el-select
          v-model.trim="approvalStatus"
          placeholder="全部"
          :popper-append-to-body="false"
          @change="okrReviewList"
          clearable
          popper-class="tl-select-dropdown"
          class="tl-select has-bg"
        >
          <el-option
            :label="item.name"
            :value="item.status"
            v-for="(item, index) in CONST.REPLAY_ASSESS_STATUS_LIST"
            :key="index"
          ></el-option>
        </el-select>
      </dl>
      <el-button plain class="tl-btn light" @click="okrReviewList"
        >搜索</el-button
      >
    </div>
    <div class="cont-area">
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table" row-key="id">
            <el-table-column prop="orgName" label="部门" min-width="215">
            </el-table-column>

            <el-table-column
              prop="userName"
              label="负责人"
              min-width="80"
            ></el-table-column>
            <el-table-column prop="submitTime" label="提交时间" min-width="130">
              <template slot-scope="props">
                <span>{{ props.row.submitTime || "--" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reviewTime" label="复核时间" min-width="130">
              <template slot-scope="props">
                <span>{{ props.row.reviewTime || "--" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalStatus"
              label="绩效复核状态"
              min-width="100"
            >
              <template slot-scope="props">
                <span>{{
                  CONST.APPROVAL_SCORE_STATUS_MAP[
                    props.row.approvalStatus || "1"
                  ].name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="enableCommunicate"
              label="是否已线下沟通"
              min-width="100"
            >
              <template slot-scope="props">
                <span v-if="props.row.enableCommunicate">{{
                  CONST.COMMUN_MAP[props.row.enableCommunicate]
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="score1"
              label="操作"
              min-width="100"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.approvalStatus == 2"
                  type="text"
                  @click="showAssesspast(scope.row, 'edit')"
                  class="tl-btn"
                  >绩效复核
                </el-button>
                <el-button
                  v-else-if="
                    scope.row.approvalStatus == 3 ||
                    scope.row.approvalStatus == 4
                  "
                  type="text"
                  @click="showAssesspast(scope.row, 'detail')"
                  >详情
                </el-button>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-assesspast
      ref="assesspast"
      :periodId="periodId"
      @success="okrReviewList"
    ></tl-assesspast>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import assessPast from './components/assessPast';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'replayAssessList',
  data() {
    return {
      CONST,
      server,
      periodIdList: [],
      orgFullIdList: [],
      departmentData: [],
      periodId: '',
      orgId: '',
      tableData: [],
      approvalStatus: '',
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-assesspast': assessPast,
  },
  mounted() {
    this.getOkrCycleList();
    this.getOrgTable();
  },
  methods: {
    okrReviewList() {
      if (this.periodId && this.orgId) {
        sessionStorage.setItem('historyPer', this.periodId);
        this.server.summaryReview({
          periodId: this.periodId,
          orgId: this.orgId,
          approvalStatus: this.approvalStatus,
        }).then((res) => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        });
      }
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
    // 详情
    showAssesspast(row, type) {
      this.$refs.assesspast.show(row, type);
    },
  },
};
</script>

<style>
</style>