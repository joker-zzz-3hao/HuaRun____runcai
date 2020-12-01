<template>
  <div class="replay-list">
    <div class="operating-box">
      <dl class="dl-item">
        <dt>周期</dt>
      </dl>
      <dl class="dl-item">
        <dt>组织</dt>
      </dl>
      <dl class="dl-item">
        <dt>复核状态</dt>
      </dl>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="okrReviewList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="userName" label="部门"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="userName" label="OKR周期"></el-table-column>
            <el-table-column prop="userName" label="复核状态"></el-table-column>
            <el-table-column prop="userName" label="OKR进度"></el-table-column>
            <el-table-column prop="userName" label="OKR得分"></el-table-column>
            <el-table-column prop="userName" label="复核得分"></el-table-column>
            <el-table-column width="80" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="tl-btn"
                  @click="
                    $router.push({
                      name: 'replayScoreDetail',
                      query: {
                        okrId: scope.row.okrId,
                      },
                    })
                  "
                >
                  复盘得分
                </el-button>
                <el-button type="text" class="tl-btn"> 详情 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();

export default {
  name: 'replayScoreList',
  data() {
    return {
      server,
      tableData: [],
      pageSize: 20,
      totalpage: 0,
      currentPage: 1,
    };
  },
  created() {
    this.getOkrCycleList();
  },
  methods: {
    okrReviewList() {
      sessionStorage.setItem('historyPer', this.periodId);
      this.server.okrReviewList({

        periodId: this.periodId, // 周期id，必传
        reviewStatus: this.reviewStatus, // 复盘状态 1、待复盘，2、待沟通，3、复盘结束;<不传参数，则表示查询全部>
        userName: this.userName, // 支持精确搜索
        currentPage: this.currentPage, // 可以不传，默认是1
        pageSize: this.pageSize, // 可以不传，默认是20

      }).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
      });
    },
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;
        if (sessionStorage.getItem('historyPer')) {
          this.periodId = sessionStorage.getItem('historyPer');
        } else {
          this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
        }

        this.okrReviewList();
      });
    },
  },
};
</script>

<style>
</style>