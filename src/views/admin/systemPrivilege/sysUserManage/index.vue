<template>
  <div class="system-user-management">
    <div>
      <div>系统用户管理</div>
    </div>
    <crcloud-table
      :total="total"
      :pageSize.sync="pageSize"
      :currentPage.sync="currentPage"
      @searchList="searchList"
    >
      <div slot="tableContainer">
        <el-table ref="orgTable" v-loading="loading" :data="tableData">
          <el-table-column align="left" width="50" type="index" label="序号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userId" label="用户账号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userAccount" label="用户角色"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userName" label="账号类型"></el-table-column>
          <el-table-column min-width="120px" align="left" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column min-width="130px" align="left" prop="corpGroupName" label="操作">
            <template slot-scope="scope">
              <el-button v-show="scope.row.userType!='1'" @click="createOrEditUser(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>
    <!-- 创建部门 -->
    <el-dialog
      ref="createDepart"
      v-if="visible"
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="重置密码"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" ref="resetForm">
        <el-form-item
          label="原始密码"
          prop="loginPwd"
          :rules="[
          {required:true,validator: validatePwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.loginPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd"
          :rules="[{required:true,validator:validateNewPwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.newPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
          {required:true,validator: validateNewConfirmPwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.confirmPwd" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="save">确认</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Server from './server';
import validateMixin from './validateMixin';

const server = new Server();

export default {
  name: 'sysUserManage',
  mixins: [validateMixin],
  components: {
  },
  data() {
    return {
      server,
      loading: false,
      visible: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      formData: {
        loginPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
    };
  },
  created() {
    this.searchList();
    this.resetPwd();
  },
  methods: {
    searchList() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      this.server.getUserLIst(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
      });
    },

    resetPwd() {
      this.visible = true;
    },
    save() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.server.editPwd().then((res) => {
            if (res.code == 200) {
              this.$message.success('重置密码成功');
            }
            this.visible = false;
          });
        }
      });
    },
    // 关闭弹窗
    close() {
      this.visible = false;
    },
  },
  watch: {

  },
};
</script>