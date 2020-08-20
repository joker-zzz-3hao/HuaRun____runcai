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
        <el-table :data="tableData" class="tl-table">
          <el-table-column fixed prop="periodName" label="OKR周期名称">
            <template slot-scope="scope">
              <em>{{scope.row.periodName}}</em>
              <span v-if="scope.row.checkStatus=='1'">默认周期</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="checkStatus" label="状态" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model.trim="scope.row.periodType"
                :active-text="scope.row.periodType==1?'启用':'禁用'"
                active-value="1"
                inactive-value="0"
                @change="statusList(scope.row)"
                class="tl-switch"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-button type="text" @click="updateOkr(scope.row)" class="tl-btn">编辑</el-button>
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
    addOrUpdate(row) {
      this.server.addOrUpdate({
        periodId: row.periodId,
        periodType: row.periodType,
      }).then((res) => {
        if (res.code == 200) {
          this.getTableList();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
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
      this.updateData = JSON.parse(JSON.stringify(row));
    },
    statusList(row) {
      this.$confirm('是否确认修改状态', '状态确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.addOrUpdate(row);
      }).catch(() => {
        this.getTableList();
      });
    },
  },

};
</script>