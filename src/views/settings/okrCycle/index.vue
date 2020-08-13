<template>
  <div class="okr-cycle">
    <el-button type="primary" @click="addOkr()">添加周期</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="periodName" label="OKR周期名称"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="checkStatus" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.checkStatus"
            active-text="启用"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateOkr(scope.row)">编辑</el-button>
          <!-- <el-button type="text" size="small">移除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <tl-add-okr-cycle
      :exist.sync="exist"
      v-if="exist"
      :title="title"
      :updateData="updateData"
      @getTableList="getTableList"
    ></tl-add-okr-cycle>
  </div>
</template>

<script>
import addOkrCycle from './components/addOkrCycle';
import Server from './server';

const server = new Server();
export default {
  name: 'okrCycle',
  components: {
    'tl-add-okr-cycle': addOkrCycle,
  },
  data() {
    return {
      tableData: [],
      server,
      exist: false,
      title: '',
      updateData: '',
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      this.server.okrQuery().then((res) => {
        this.tableData = res.data;
      });
    },
    addOkr() {
      this.title = '添加周期';
      this.exist = true;
    },
    updateOkr(row) {
      this.title = '编辑周期';
      this.exist = true;
      this.updateData = row;
    },
  },

};
</script>