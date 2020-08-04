<template>
  <div class="home">
    <div style="display: flex;">
      <div>
        <el-select
          v-model="periodId"
          placeholder="请选择周期"
          style="width:240px;"
          :disabled="!okrCycleList.length>0"
        >
          <el-option
            v-for="item in okrCycleList"
            :key="item.periodId"
            :label="item.periodName"
            :value="item.periodId"
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
      periodId: '',
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
          self.periodId = self.okrCycleList[0].periodId;
        }
      });
      // 查询组织树
      self.server.getDepartmentList().then((res) => {
        self.departmentData = res.data;
      });
    },
    search() {
      const self = this;
      self.server.searchKeyword({
        keyword: self.keyword,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
        }
      });
    },
    handleData(data) {
      console.log(data);
    },
  },
};
</script>