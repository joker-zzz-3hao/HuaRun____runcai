<template>
  <div class="replay-list">
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
      <dt>绩效复核状态</dt>
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
          v-for="(item, index) in CONST.REPLAY_ASSESS_STATUS_LIST"
          :key="index"
        ></el-option>
      </el-select>
    </dl>
    <div class="cont-area">
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table" row-key="id">
            <el-table-column prop="num" label="部门" min-width="165">
            </el-table-column>

            <el-table-column
              prop="num"
              label="负责人"
              min-width="165"
            ></el-table-column>
            <el-table-column
              prop="org"
              label="提交时间"
              min-width="170"
            ></el-table-column>

            <el-table-column prop="user" label="复核时间" min-width="100">
            </el-table-column>
            <el-table-column
              prop="score"
              label="是否已经确认沟通"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="score1"
              label="操作"
              min-width="100"
            >
              <template>
                <el-button type="text" @click="$router.push('/assessPast')"
                  >绩效复核</el-button
                >
                <el-button type="text" @click="$router.push('/assessDetail')"
                  >详情</el-button
                >
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
  name: 'repalyAssessList',
  data() {
    return {
      CONST,
      server,
      periodIdList: [],
      orgFullIdList: [],
      departmentData: [],
      periodId: '',
      tableData: [
        {
          num: 1,
          org: '部门',
          user: '11',
          score: 1,
        },
      ],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {
    this.getOkrCycleList();
    this.getOrgTable();
  },
  methods: {
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;

        this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
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