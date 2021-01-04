<template>
  <div class="my-task">
    <div class="operating-area">
      <div class="operating-box">
        <el-button
          type="primary"
          icon="el-icon-folder-checked"
          class="tl-btn amt-bg-slip"
          @click="createGroupAdd"
          >创建小组</el-button
        >
      </div>
    </div>
    <tl-crcloud-table :isPage="false" class="project-members">
      <div slot="tableContainer" class="table-container">
        <el-table :data="queryList" class="tl-table">
          <el-table-column
            prop="projectTeamName"
            label="小组名称"
            min-width="140"
          >
          </el-table-column>
          <el-table-column
            prop="projectTeamLeaderName"
            label="组长"
            min-width="160"
          >
            <template slot-scope="scope">
              <span v-if="hasValue(scope.row.projectTeamLeaderName)">{{
                scope.row.projectTeamLeaderName
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>

          <el-table-column prop="createDate" label="创建时间" min-width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="showEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                style="margin-left: 20px"
                @click="remove(scope.row)"
                >解散</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
    <tl-create-group
      ref="createGroup"
      @getList="getList"
      :baseInfo="baseInfo.projectUserVoList"
    ></tl-create-group>
    <tl-edit-select ref="editGroup" @getList="getList"></tl-edit-select>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import createGroup from '../../components/createGroup';
import editSelect from '../../components/editGroup';
import Server from '../../server';

const server = new Server();
export default {
  name: 'projectStatistics',
  data() {
    return {
      server,
      total: 0,
      currentPage: 0,
      pageSize: 0,
      tableData: [],
      userList: [],
      radio: '',
      listInfo: {},
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-create-group': createGroup,
    'tl-edit-select': editSelect,
  },
  props: {
    summaryList: {
      type: Array,
      default() {
        return [];
      },
    },
    baseInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    queryList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {

  },
  methods: {
    showEdit(row) {
      this.$refs.editGroup.show(row);
    },
    getSelectId(row, userId) {
      this.server.saveOrUpdateProjectTeam({
        ...row,
        projectTeamLeader: userId,
      }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success('修改成功');
        }
      });
    },

    remove(row) {
      this.$confirm(`请谨慎操作，确认要解散"${row.projectTeamName}"? 
      解散后，将不可恢复，工时审批不受影响`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.removeList(row);
      }).catch(() => {
        console.log('取消');
      });
    },
    removeList(row) {
      this.server.delProjectTeam({
        projectTeamId: row.projectTeamId,
        projectId: row.projectId,
      }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success('删除成功');
        }
      });
    },
    createGroupAdd() {
      this.$refs.createGroup.show();
    },
    getList() {
      this.$emit('queryProjectTeam');
    },
  },
  watch: {},
};
</script>
