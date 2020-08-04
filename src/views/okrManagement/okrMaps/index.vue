<template>
  <div class="home">
    <div style="display: flex;">
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
      <div style="margin-left:20px;">
        <department :data="departmentData" @handleData="handleData"></department>
      </div>
      <div>
        <el-input placeholder="部门名称/成员/关键词" v-model="keyword">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
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
      keyword: '',
      okrCycleList: [],
      departmentData: [],
    };
  },
  components: {
    department,
  },
  mounted() {
    const self = this;
    // self.server.test().then((res) => {
    //   console.log(res);
    // });
    self.init();
  },
  methods: {
    init() {
      const self = this;
      // 查询周期
      self.server.getOkrCycleList().then((res) => {
        self.okrCycleList = res.data;
        if (self.okrCycleList.length > 0) {
          self.okrCycle = self.okrCycleList[0].okrCycleCode;
        }
      });
      // 查询组织树
      self.server.getDepartmentList().then((res) => {
        self.departmentData = res.data;
      });
    },
    search() {},
    handleData(data) {
      console.log(data);
    },
  },
};
</script>