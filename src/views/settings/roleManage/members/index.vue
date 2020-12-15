<template>
  <div class="member-manage">
    <div class="operating-area">
      <div class="page-title">成员管理</div>
      <div class="operating-box">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddRoule"
          v-if="$route.query.roleType!=='SYSTEM'"
          class="tl-btn amt-bg-slip"
        >添加成员</el-button>
        <el-button
          plain
          v-if="$route.query.roleType!=='SYSTEM'"
          icon="el-icon-minus"
          @click="handleDelete"
          class="tl-btn amt-border-slip"
        >
          移除成员
          <span class="lines"></span>
        </el-button>
        <el-button plain @click="$router.back()" class="tl-btn amt-border-slip">
          返回
          <span class="lines"></span>
        </el-button>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="listRoleUser"
      >
        <div slot="tableContainer">
          <el-table :data="tableData" @selection-change="handleSelectionChange" class="tl-table">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userAccount" label="用户帐号" min-width="165"></el-table-column>
            <el-table-column prop="userName" label="用户姓名" min-width="90"></el-table-column>
            <el-table-column prop="userMobile" label="手机号" min-width="120"></el-table-column>
            <el-table-column prop="orgName" label="所在团队" min-width="180"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.createTime"
                >{{ dateFormat("YYYY-mm-dd HH:MM:SS", new Date(scope.row.createTime))}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="60">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDeleteOne(scope.row.id)" class="tl-btn">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
      <tl-add-member
        v-if="exist"
        :exist.sync="exist"
        :title="title"
        :rouleType="rouleType"
        @getTableList="listRoleUser"
      ></tl-add-member>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import global from '@/mixin/global';
import addMember from './components/addMember';
import Server from './server';

const server = new Server();
export default {
  created() {
    this.listRoleUser();
  },
  mixin: [global],
  methods: {
    showAddRoule() {
      this.title = '添加成员';
      this.exist = true;
    },
    putRoule() {
      this.title = '编辑角色';
      this.exist = true;
    },
    handleDelete() {
      if (this.listUserRole.length == 0) {
        this.$message.error('请勾选删除项');
        return false;
      }
      this.$xconfirm({ title: '该数据删除将无法恢复，确认要删除吗？', content: '' })
        .then(() => {
          this.delUserRole(this.listUserRole);
        })
        .catch(() => {});
    },
    handleDeleteOne(id) {
      this.$xconfirm({ title: '该数据删除将无法恢复，确认要删除吗？', content: '' })
        .then(() => {
          this.delUserRole([{ id }]);
        })
        .catch(() => {});
    },
    delUserRole(listUserRole) {
      this.server.delUserRole({
        listUserRole,
      }).then((res) => {
        if (res.code == 200) {
          this.listRoleUser();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSelectionChange(data) {
      const listUserRole = data.map((item) => ({ id: item.id }));
      this.listUserRole = listUserRole;
    },
    listRoleUser() {
      this.server.listRoleUser({
        roleId: this.$route.query.roleId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.totalpage = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  components: {
    'tl-add-member': addMember,
    'tl-crcloud-table': crcloudTable,
  },
  data() {
    return {
      listUserRole: [],
      server,
      title: '',
      rouleType: false, // 是否内置管理员
      exist: false,
      value: [],
      inputValue: '',
      currentPage: 1,
      pageSize: 10,
      totalpage: 0,
      tableData: [],
    };
  },
};
</script>