<template>
  <div class="home">
    <div>
      <div>
        <el-select
          v-model="okrCycle"
          placeholder="请选择周期"
          style="width:240px;"
          :disabled="!okrCycleList.length>0"
        >
          <el-option
            v-for="item in okrCycleList"
            :key="item.okrCycleCode"
            :label="item.okrCycleName"
            :value="item.okrCycleCode"
          ></el-option>
        </el-select>
      </div>
      <div>
        <department></department>
      </div>
    </div>
  </div>
</template>

<script>
import department from '@/components/department';
import Server from './server';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      server,
      okrCycle: '',
      okrCycleList: [],
    };
  },
  components: {
    department,
  },
  mounted() {
    const self = this;
    self.server.test().then((res) => {
      console.log(res);
    });
    self.init();
  },
  methods: {
    init() {
      const self = this;
      self.server.getOkrCycleList().then((res) => {
        self.okrCycleList = res.data;
        if (self.okrCycleList.length > 0) {
          self.okrCycle = self.okrCycleList[0].okrCycleCode;
        }
      });
    },
  },
};
</script>