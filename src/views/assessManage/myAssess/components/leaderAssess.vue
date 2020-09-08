<template>
  <div class="home">
    <div>
      <div style="display:inline-block">周期</div>
      <el-select v-model="periodId" placeholder="请选择" @change="orgQuarterList">
        <el-option
          v-for="(item,index) in cycList"
          :key="index+item.periodId"
          :value="item.periodId"
          :label="item.periodName"
        ></el-option>
      </el-select>
      <div style="display:inline-block">考核状态</div>
      <el-select v-model="status" placeholder="请选择" @change="orgQuarterList">
        <el-option :value="1" label="考核中"></el-option>
        <el-option :value="2" label="考核结束"></el-option>
      </el-select>
      <div style="display:inline-block">成员</div>
      <el-input v-model="userName" style="width:280px" placeholder="请输入成员姓名"></el-input>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="periodName" label="OKR周期" width="180"></el-table-column>
      <el-table-column prop="status" label="考核状态">
        <template slot-scope="scope">
          <span>{{scope.row.status==1?'考核中':'考核结束'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="okrProgress" label="OKR进度">
        <template slot-scope="scope">
          <span v-if="scope.row.okrProgress">{{scope.row.okrProgress}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="superiorScore" label="成员评分"></el-table-column>
      <el-table-column prop="ownScore" label="评分"></el-table-column>
      <el-table-column fixed="right" label="查看详情" width="130">
        <template>
          <el-button type="text" size="small">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Server from '../../server';

const server = new Server();
export default {
  name: 'myAssess',
  data() {
    return {
      cycList: [],
      server,
      periodId: '',
      value: '',
      userName: '',
      tableData: [],
      status: '',
    };
  },
  mounted() {
    this.orgQuarterList();
    this.getOkrCycleList();
  },
  methods: {

    orgQuarterList() {
      this.server.orgQuarterList({
        periodId: this.periodId,
        status: this.status,
        userName: this.userName,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.cycList = res.data;
        this.periodId = res.data[0].periodId;
        this.orgQuarterList();
      });
    },

  },
  components: {
  },
};
</script>