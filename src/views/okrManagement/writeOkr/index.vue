<template>
  <div class="home">
    <!-- 写okr选择时间和okr类型 -->
    <div v-if="canWrite">
      <el-select v-model="searchForm.time" placeholder="请选择时间" :popper-append-to-body="false">
        <el-option
          v-for="(item, index) in timelist"
          :key="item.timeid+index"
          :label="item.timecycle"
          :value="item.timeid"
        ></el-option>
      </el-select>
      <el-select v-model="searchForm.okrType" placeholder="请选择类型" :popper-append-to-body="false">
        <el-option
          v-for="(item, index) in CONST.OKR_TYPE_LIST"
          :key="item.id+index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <!-- okr详情 -->
    <div v-else>
      <ul>
        <li>
          <span>目标类型</span>
          <span>{{}}</span>
        </li>
        <li>
          <span>负责人</span>
          <span>{{}}</span>
        </li>
        <li>
          <span>更新时间</span>
          <span>{{}}</span>
        </li>
        <li>
          <span>进度</span>
          <span>
            <el-progress :stroke-width="10" :percentage="50"></el-progress>
          </span>
        </li>
      </ul>
    </div>
    <okr-form v-if="canWrite" :searchForm="searchForm" :server="server" :canWrite="canWrite"></okr-form>
    <okr-detail v-else :server="server"></okr-detail>
  </div>
</template>

<script>
import okrForm from './component/okrForm';
import okrDetail from './component/okrDetail';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'writeOkr',
  components: {
    'okr-form': okrForm,
    'okr-detail': okrDetail,
  },
  data() {
    return {
      server,
      CONST,
      timelist: [],
      searchForm: {
        status: '01',
        time: '',
        okrType: '',
        timecycle: '',
      },
      canWrite: true, // true写okr false okr详情
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.server.getTimeCycle().then((response) => {
        // console.log(response.data);
        this.timelist = response.data;
        // 默认选中当前周期
        this.searchForm.time = this.timelist[0].timeid;
      });
    },
  },
  watch: {
    'searchForm.time': {
      handler(newVal) {
        const timeInfo = this.timelist.filter(
          (item) => item.timeid == newVal,
        )[0] || {};
        this.searchForm.timecycle = timeInfo.timecycle;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>