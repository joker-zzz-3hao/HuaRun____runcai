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

    <okr-form v-if="canWrite" :searchForm="searchForm" :server="server" :canWrite="canWrite"></okr-form>
  </div>
</template>

<script>
import okrForm from './component/okrForm';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'writeOkr',
  components: {
    'okr-form': okrForm,
  },
  data() {
    return {
      server,
      CONST,
      timelist: [],
      okrmain: {},
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
    this.canWrite = this.$route.params.canWrite || false;
    console.log('can', this.canWrite);
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