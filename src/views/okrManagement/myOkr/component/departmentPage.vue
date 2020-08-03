<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <el-select v-model="searchForm.time" placeholder="请选择时间">
        <el-option
          v-for="item in timelist"
          :key="item.timeid"
          :label="item.timecycle"
          :value="item.timeid"
        ></el-option>
      </el-select>
      <dl>
        <dd v-for="item in CONST.STATUS_LIST" :key="item.id">{{item.name}}</dd>
      </dl>
    </div>
    <!-- 用展开行表格 -->
    <div>
      <el-table :data="tableList">
        <el-table-column type="expand" width="50">
          <template slot-scope="scope">
            <div v-for="kritem in scope.row.krList" :key="kritem.krId">
              <span>KRicon</span>
              <span>{{kritem.krName}}</span>
              <span>{{kritem.percent}}%</span>
              <div class="progresswidth">
                <el-progress :stroke-width="10" :percentage="kritem.progress"></el-progress>
              </div>
              <span>信心指数{{kritem.confidence}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="objectName" label="关键目标" width="220"></el-table-column>
        <el-table-column prop="percent" label="权重" width="120">
          <template slot-scope="scope">{{scope.row.percent}}%</template>
        </el-table-column>
        <el-table-column prop="progress" label="进度条" width="120">
          <template slot-scope="scope">
            <el-progress :stroke-width="10" :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="confidence" label="信心指数" width="120"></el-table-column>
        <el-table-column prop="map" label="承接地图" width="120"></el-table-column>
      </el-table>
    </div>
    <!-- 展示头像 -->
    <div>
      <p>头像or部门logo</p>
    </div>
  </div>
</template>

<script>
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'crcloudTable',
  data() {
    return {
      server,
      CONST,
      tableList: [],
      searchForm: {},
      timelist: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.server.getokrdata().then((res) => {
        console.log(res);
        this.tableList = res.data;
      });
      this.server.getTimeCycle().then((response) => {
        console.log(response.data);
        this.timelist = response.data;
      });
    },
    gocheng() {
      this.$message('要跳到承接地图啦~');
    },
  },
};
</script>

<style>
.collapse span,
.collapsetitle span {
  margin-left: 10px;
}

.collapsetitle {
  margin-left: 250px;
}
.progresswidth {
  width: 150px;
  display: inline-block;
}
</style>