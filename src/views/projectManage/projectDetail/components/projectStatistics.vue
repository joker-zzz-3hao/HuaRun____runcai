<template>
  <div>
    <tl-crcloud-table :isPage="false">
      <div slot="tableContainer" class="table-container">
        <el-table :data="summaryList" class="tl-table">
          <el-table-column prop="userName" label="姓名" min-width="140">
            <template slot-scope="scope">
              <div class="user-info">
                <img v-if="scope.row.headUrl" :src="scope.row.headUrl" alt />
                <div v-else-if="scope.row.userName" class="user-name">
                  <em>{{
                    scope.row.userName.substring(scope.row.userName.length - 2)
                  }}</em>
                </div>
              </div>
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="部门" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.orgName">{{ scope.row.orgName }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="timeSheet" label="合计工时" min-width="120">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="加入项目时间"
            min-width="180"
          >
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';

export default {
  name: 'projectStatistics',
  data() {
    return {
      total: 0,
      currentPage: 0,
      pageSize: 0,
      tableData: [],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  props: {
    summaryList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {},
  methods: {},
  watch: {},
};
</script>