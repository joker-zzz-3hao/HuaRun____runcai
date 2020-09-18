<template>
  <div class="role-type">
    <div>
      <div class="page-title">价值观分布数据</div>
      <div>
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
          <el-form-item label="周期">
            <div style="margin-left:20px;" v-if="cycleData.length>0">
              <el-select
                v-model="periodId"
                placeholder="请选择目标周期"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
                @change="handleCycleData"
              >
                <el-option
                  v-for="item in cycleData"
                  :key="item.periodId"
                  :label="item.periodName"
                  :value="item.periodId"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
        <!-- 柱形图 -->
        <div>
          <div id="lineChart" style="width: 1072px;height: 400px;"></div>
        </div>
        <div>成就客户</div>
        <div>忠诚爱国，崇尚公平正义，敬畏法纪、尊重制度，坚守法律和道德底线。</div>
        <div>
          <tl-crcloud-table :isPage="false">
            <div slot="tableContainer" class="table-container">
              <el-table :data="tableData" class="tl-table">
                <el-table-column prop="value" label="支撑数" min-width="180"></el-table-column>
                <el-table-column prop="orgName" label="来自" min-width="120"></el-table-column>
              </el-table>
            </div>
          </tl-crcloud-table>
        </div>
        <div>
          <div>价值观评价</div>
          <div>
            <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
              <el-form-item label="周期">
                <div style="margin-left:20px;" v-if="cycleData.length>0">
                  <el-select
                    v-model="worthPeriodId"
                    placeholder="请选择目标周期"
                    :popper-append-to-body="false"
                    popper-class="tl-select-dropdown"
                    class="tl-select"
                    @change="handleWorthData"
                  >
                    <el-option
                      v-for="item in cycleData"
                      :key="item.periodId"
                      :label="item.periodName"
                      :value="item.periodId"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div style="display:flex;">
            <div v-for="item in worthList.cultureList" :key="item.id">
              <el-card style="width: 200px;">
                <div
                  v-for="cItem in item.scoreList"
                  :key="cItem.score"
                  style="display: flex;justify-content: space-between;"
                >
                  <div>{{CONST.SCORE_MAP[cItem.score]}}</div>
                  <div>{{cItem.culture_number}}</div>
                </div>
              </el-card>
              <div>{{item.cultureName}}</div>
            </div>
          </div>
          <div v-if="worthList.otherList && worthList.otherList.length>0">
            <div>其他标签</div>
            <div v-for="bItem in worthList.otherList" :key="bItem.id">
              <el-button type="primary" round>
                <div style="display: flex;justify-content: space-between;">
                  <div>{{bItem.score_label}}</div>
                  <div>({{bItem.culture_number}})</div>
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import echarts from 'echarts';
import CONST from '../const';
import Server from '../server';

const server = new Server();
export default {
  name: 'worthStatistics',
  data() {
    return {
      server,
      CONST,
      showCascader: false,
      formData: {
        orgName: '',
        orgFullId: '',
      },
      departmentData: [],
      orgFullIdList: [],
      orgFullId: '',
      orgId: '',
      cycleData: [],
      xData: [],
      yData: [],
      department: '',
      yObj: [],
      tableData: [],
      okrCycle: {},
      worthCycle: {},
      worthList: {},
      periodId: '',
      worthPeriodId: '',
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {
    const self = this;
    self.getOrgTable();
    self.server.getOkrCycleList().then((res) => {
      this.cycleData = res.data;
      if (this.cycleData.length > 0) {
        const cycObj = this.cycleData.filter((item) => item.checkStatus == '1')[0] || {};
        this.periodId = cycObj.periodId;
        this.handleCycleData(this.periodId);
        this.worthPeriodId = cycObj.periodId;
        this.handleWorthData(this.worthPeriodId);
      }
    });
  },
  methods: {
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '支撑数',
            type: 'bar',
            barWidth: '60%',
            data: this.yObj,
          },
        ],
      });

      this.charts.on('click', (params) => {
        console.log(params);
        this.tableData = params.data.detail;
      });
    },
    searchOrgCulture() {
      if (this.okrCycle.startTime && this.orgId) {
        this.server.orgCulture({
          begDate: this.okrCycle.startTime,
          endDate: this.okrCycle.endTime,
          orgId: this.orgId,
        }).then((res) => {
          if (res.code == '200') {
            this.tableData = [];
            console.log(res);
            this.xData = [];
            this.yData = [];
            this.yObj = [];
            if (res.data.length > 0) {
              // 取x轴
              res.data[0].cultureList.forEach((cItem) => {
                this.xData.push(cItem.cultureName);
                this.yObj.push({
                  cultureName: cItem.cultureName,
                  value: 0,
                  detail: [],
                });
              });
              // 取Y轴数据
              res.data.forEach((item) => {
                this.department = item.orgName;
                item.cultureList.forEach((yItem, index) => {
                  this.yObj[index].value += yItem.cultureNumber;
                  this.yObj[index].detail.push({
                    orgName: item.orgName,
                    value: yItem.cultureNumber,
                  });
                });
              });
              this.tableData = this.yObj[0].detail;
              console.log(this.xData);
              console.log(this.yObj);
            }
            this.drawLine('lineChart');
          }
        });
      }
    },
    handleCycleData(data) {
      this.cycleData.forEach((item) => {
        if (item.periodId == data) {
          this.okrCycle = item;
          this.searchOrgCulture();
        }
      });
    },
    handleWorthData(data) {
      this.cycleData.forEach((item) => {
        if (item.periodId == data) {
          this.worthCycle = item;
          this.queryWorth();
        }
      });
    },
    queryWorth() {
      this.server.tenantCultureScore({
        begDate: this.worthCycle.startTime,
        endDate: this.worthCycle.endTime,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.worthList = res.data;
        }
      });
    },
    selectIdChange(data) {
      this.showCascader = false;
      this.orgFullId = data[data.length - 1];
      this.orgFullIdList = this.orgFullId.split(':');
      this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.orgId = this.orgFullIdList[this.orgFullIdList.length - 1];
      this.searchOrgCulture();
      this.getOrgName(this.departmentData, 0);
      this.searchOrgCulture();
    },
    getOrgTable() {
      // 查询组织树
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData.push(res.data);
            this.formData.orgFullId = this.departmentData[0].orgFullId;
            console.log(this.formData.orgFullId);
            this.orgFullIdList = this.formData.orgFullId.split(':');
            this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.orgId = this.orgFullIdList[this.orgFullIdList.length - 1];
            this.searchOrgCulture();
            this.getOrgName(this.departmentData, 0);
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
  },
};
</script>