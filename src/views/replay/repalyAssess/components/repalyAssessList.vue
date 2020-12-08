<template>
  <div class="replay-list">
     <dl class="dl-item">
        <dt>周期</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="用户类型"
            :popper-append-to-body="false"
            @change="okrReviewList"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>
          <dl class="dl-item">
        <dt>组织</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="用户类型"
            :popper-append-to-body="false"
            @change="okrReviewList"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>
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
            <template>
              <el-button type="text" @click="$router.push('/assessPast')">绩效复核</el-button>
               <el-button type="text" @click="$router.push('/assessDetail') ">详情</el-button>
            </template>
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
      tableData: [
        {
          num: 1,
          org: '部门',
          user: '11',
          score: 1,
        },
      ],
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