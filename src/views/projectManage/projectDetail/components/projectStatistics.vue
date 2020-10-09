<template>
  <div>
    <tl-crcloud-table
      :total="total"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      @searchList="searchList"
    >
      <div slot="tableContainer" class="table-container">
        <el-table :data="tableData" class="tl-table">
          <el-table-column prop="projectName" label="姓名" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.projectName">{{
                scope.row.projectName
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="级别" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.projectName">{{
                scope.row.projectName
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectStatus"
            label="所属部门"
            min-width="120"
          >
          </el-table-column>
          <el-table-column prop="projectType" label="职能" min-width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                @click="deleteMember(scope.row)"
                type="text"
                class="tl-btn"
                >移除</el-button
              >
            </template>
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
  props: {},
  mounted() {},
  methods: {
    searchList() {},
    deleteMember(data) {
      console.log(data);
    },
  },
  watch: {},
};
</script>