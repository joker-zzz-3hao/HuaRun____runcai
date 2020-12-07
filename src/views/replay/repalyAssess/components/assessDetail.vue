<template>
  <div class="replay-list">

       <div class="cont-area">
               <tl-crcloud-table
               :isPage="false"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table" row-key="id" >
             <el-table-column
              prop="num"
              label="部门"
              min-width="165"
            >

            </el-table-column>

            <el-table-column
              prop="num"
              label="负责人"
              min-width="165"
            ></el-table-column>
            <el-table-column
              prop="org"
              label="提交时间"
              min-width="170"
            ></el-table-column>

            <el-table-column
              prop="user"
              label="复核时间"
              min-width="100"
            >
            </el-table-column>
             <el-table-column
              prop="score"
              label="是否已经确认沟通"
              min-width="100"
            >
            </el-table-column>
               <el-table-column
              fixed="right"
              prop="score1"
              label="操作"
              min-width="100"
            >
            </el-table-column>

          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import Server from '../../server';

const server = new Server();
export default {
  name: 'repalyAssessList',
  data() {
    return {
      periodIdList: [],
      periodId: '',
      server,
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {
    this.getOkrCycleList();
  },
  methods: {
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;

        this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
      });
    },
  },
};
</script>

<style>
</style>