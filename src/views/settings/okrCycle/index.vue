<template>
  <div class="okr-cycle">
    <div class="operating-area">
      <div class="page-title">设置OKR周期与自评</div>
      <div class="operating-panel">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addOkr()"
          class="tl-btn amt-bg-slip"
        >添加周期</el-button>
      </div>
    </div>
    <div class="cont-area">
      <div class="cont-panel">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="periodName" label="OKR周期名称">
            <template slot-scope="scope">
              <span>{{scope.row.periodName}}{{scope.row.checkStatus=='1'?'(默认周期)':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="checkStatus" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model.trim="scope.row.periodType"
                active-text="启用"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateOkr(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <tl-add-okr-cycle
          :exist.sync="exist"
          v-if="exist"
          :title="title"
          :updateData.sync="updateData"
          @getTableList="getTableList"
        ></tl-add-okr-cycle>
        <tl-put-okr-cycle
          :exist.sync="existPut"
          v-if="existPut"
          :title="title"
          :updateData.sync="updateData"
          @getTableList="getTableList"
        ></tl-put-okr-cycle>
      </div>
      <div class="operating-panel">这里是底部操作区，这里可以放 按钮、翻页控件等</div>
    </div>
  </div>
</template>

<script>
import addOkrCycle from './components/addOkrCycle';
import putOkrCycle from './components/putOkrCycle';
import Server from './server';

const server = new Server();
export default {
  name: 'okrCycle',
  components: {
    'tl-add-okr-cycle': addOkrCycle,
    'tl-put-okr-cycle': putOkrCycle,
  },
  data() {
    return {
      tableData: [],
      server,
      exist: false,
      existPut: false,
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
      this.existPut = true;
      this.updateData = row;
    },
  },

};
</script>