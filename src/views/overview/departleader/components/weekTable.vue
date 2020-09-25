<template>
  <div class="weeking">
    <div class="tl-card-panel">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>周报动态</em>
          <span v-show="testModel">示例数据</span>
        </div>
      </div>
      <div class="card-panel-body flex-column">
        <div class="flex-end">
          <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="dateTime"
            @change="getDate"
            :editable="false"
            :clearable="false"
            :picker-options="pickerBeginDateBefore"
            type="month"
            placeholder="选择日期"
            popper-class="tl-month-popper"
            class="tl-month-editor"
          ></el-date-picker>
          <el-select v-model="calendarId" @change="orgWeekly" placeholder="请选择">
            <el-option
              :key="index"
              :value="item.calendarId"
              v-for="(item,index) in dateOption"
              :label="item.weekBegin+' 至 '+item.weekEnd"
            ></el-option>
          </el-select>
        </div>
        <el-table :data="tableData" class="tl-table" style="width: 100%">
          <el-table-column prop="orgName" label="部门"></el-table-column>
          <el-table-column prop="orgNumber" label="部门人数"></el-table-column>
          <el-table-column label="标准/简单模式">
            <template slot-scope="scope">
              <span>{{scope.row.weeklyType0Number}}/{{scope.row.weeklyType1Number}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="visitSum" label="浏览次数"></el-table-column>
          <el-table-column prop="visitUserNumber" label="浏览人数"></el-table-column>
          <el-table-column prop="orgAdminUserName" label="负责人"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from '../../server';
import { mainData } from '../../testData';

const server = new Server();
export default {
  props: {
    periodId: {
      type: [String, Number],
    },
  },
  name: 'weeking',
  data() {
    return {
      mooddate: '',
      value: '',
      server,
      orgId: '',
      calendarId: '',
      dateTime: '',
      options: [],
      dateOption: [],
      echartDataY: [],
      echartDataX: [],
      tableData: [],
      moodDataX: [],
      moodDataY: [],
      myChartmood: '',
      active: {},
      orgTable: [],
      pickerBeginDateBefore: {
        disabledDate(time) {
          const times = new Date();
          const startValue = `${times.getFullYear()}-01`;
          const startTime = new Date(startValue);
          return time.getTime() < startTime.getTime();
        },
      },
    };
  },

  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  mounted() {
    this.fetchData();
  },

  methods: {

    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.mooddate = time;
      this.getDate(this.dateTime);
    },
    getDate(date) {
      this.calendarQurey(`${date}-01`);
    },

    calendarQurey(date) {
      this.server.calendarQurey(
        {
          date,
        },
      ).then((res) => {
        this.dateOption = res.data;
        // eslint-disable-next-line max-len
        const dateArr = this.dateOption.map((item) => [new Date(item.weekBegin).getTime(), new Date(item.weekEnd).getTime()]);
        const eq = dateArr.findIndex((item) => item[0] <= new Date().getTime() && new Date().getTime() <= item[1]);
        if (eq >= 0) {
          this.calendarId = res.data[eq].calendarId;
        } else {
          this.calendarId = res.data[0].calendarId;
        }

        this.$nextTick(() => {
          this.orgWeekly();
        });
      });
    },
    orgWeekly() {
      this.server.orgWeekly({
        calendarId: this.calendarId,
        date: `${this.dateTime}-01`,
        orgId: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
      }).then((res) => {
        this.tableData = this.testModel ? mainData.tableData.data : res.data;
      });
    },

  },
};
</script>