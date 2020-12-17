<template>
  <div class="role-type">
    <div class="operating-area">
      <div class="page-title">角色管理</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-input
              maxlength="64"
              @keyup.enter.native="listRolePage"
              v-model="keyWord"
              placeholder="请输入角色名称/创建时间/角色状态"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="listRolePage"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          v-if="hasPower('tenant-role-add')"
          type="primary"
          icon="el-icon-plus"
          @click="showAddRoule"
          class="tl-btn amt-bg-slip"
          >新增角色</el-button
        >
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="listRolePage"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="roleCode" label="角色编码" min-width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.roleCode">{{ scope.row.roleCode }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" min-width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.roleName">{{ scope.row.roleName }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="roleType" label="类型" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.roleType">{{
                  CONST.ROLE_TYPE[scope.row.roleType]
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.createTime">{{
                  dateFormat(
                    "YYYY-mm-dd HH:MM:SS",
                    scope.row.createTime
                  )
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="hasPower('tenant-role-user-query')"
                  @click="
                    $router.push({
                      path: '/members',
                      query: {
                        roleId: scope.row.roleId,
                        name: encodeURI(scope.row.roleName),
                        roleType: scope.row.roleType,
                      },
                    })
                  "
                  class="tl-btn"
                  >成员管理</el-button
                >
                <el-button
                  @click="putRoule(scope.row)"
                  v-show="scope.row.roleType == 'CREATION'"
                  type="text"
                  class="tl-btn"
                  v-if="hasPower('tenant-role-edit')"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="handleDelete(scope.row.roleId)"
                  v-show="scope.row.roleType == 'CREATION'"
                  v-if="hasPower('tenant-role-user-remove')"
                  class="tl-btn"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
      <tl-add-role
        v-if="exist"
        :exist.sync="exist"
        :title="title"
        :rouleType="rouleType"
        :roleInfo="roleInfo"
        @getSearchList="listRolePage"
      ></tl-add-role>
      <tl-put-role
        v-if="existPut"
        :exist.sync="existPut"
        :title="title"
        :rouleType="rouleType"
        :roleInfo="roleInfo"
        @getSearchList="listRolePage"
      ></tl-put-role>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import global from '@/mixin/global';
import addRole from './components/addRole';
import putRole from './components/putRole';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  created() {
    this.listRolePage();
  },
  mixins: [global],
  methods: {
    listRolePage() {
      this.server.listRolePage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        keyWord: this.keyWord,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.totalpage = res.data.total;
        }
      });
    },

    showAddRoule() {
      this.roleInfo = '';
      this.title = '新增角色';
      this.exist = true;
    },
    putRoule(row) {
      this.roleInfo = row;
      this.title = '编辑角色';
      this.existPut = true;
    },
    handleDelete(roleId) {
      this.$xconfirm({
        title: '您是否确定需要移除该成员？',
        content: '',
      }).then(() => {
        this.delRole(roleId);
      });
    },
    delRole(roleId) {
      this.server.delRole({ roleId }).then((res) => {
        if (res.code == 200) {
          this.listRolePage();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  components: {
    'tl-add-role': addRole,
    'tl-put-role': putRole,
    'tl-crcloud-table': crcloudTable,
  },
  data() {
    return {
      CONST,
      server,
      title: '',
      rouleType: false, // 是否内置管理员
      exist: false,
      existPut: false,
      value: [],
      totalpage: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      keyWord: '',
      roleInfo: '',
    };
  },
};
</script>