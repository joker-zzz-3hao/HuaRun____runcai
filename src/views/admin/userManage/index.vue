<template>
  <div class="system-user-management">
    <div>
      <div>用户管理</div>
    </div>
    <crcloud-table
      :total="total"
      :pageSize.sync="pageSize"
      :currentPage.sync="currentPage"
      @searchList="searchList"
    >
      <div slot="searchBar" class="search-conditions">
        <el-form @keyup.enter.native="searchList()">
          <el-form-item>
            <el-select v-model.trim="searchForm.tenantId" placeholder="选择租户">
              <el-option
                v-for="item in tenantList"
                :key="item.tenantId"
                :label="item.tenantName"
                :value="item.tenantId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model.trim="searchForm.userType" placeholder="用户类型">
              <el-option
                v-for="item in CONST.USER_TYPE_LIST"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model.trim="searchForm.userStatus" placeholder="用户状态">
              <el-option
                v-for="item in CONST.USER_STATUS_LIST"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-select v-model.trim="searchForm.userStatus" placeholder="租户管理员">
              <el-option
                v-for="item in CONST.USER_STATUS_LIST"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-input
              placeholder="输入用户姓名/账号/手机号"
              v-model.trim="searchForm.keyWord"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="actionBar">
        <div>
          <el-button @click="createOrEditUser">创建用户</el-button>
          <el-button @click="batchImport">批量导入</el-button>
        </div>
        <div>
          <el-button @click="searchList">查询</el-button>
        </div>
      </div>
      <div slot="tableContainer">
        <el-table ref="orgTable" v-loading="loading" :data="tableData">
          <el-table-column align="left" width="50" type="index" label="序号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userId" label="用户ID"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userAccount" label="账号/LDAP账号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userName" label="用户姓名"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userMobile" label="手机号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="tenantName" label="所属租户"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userAccount" label="租户管理员">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="dark" content="租户管理员" placement="top-start">
                  <i
                    v-if="scope.row.tenantLeader == '1'"
                    class="el-icon-user-solid"
                    @click="setLeader(scope.row)"
                  ></i>
                </el-tooltip>
                <i
                  v-if="scope.row.tenantLeader=='0'"
                  class="el-icon-user"
                  @click="setLeader(scope.row)"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="left" prop="userStatus" label="状态">
            <template slot-scope="scope">
              <!-- 0：注册 1：LDAP 2：创建 -->
              <div v-if="scope.row.userType=='1'">--</div>
              <div v-else @click.capture.stop="dataChange(scope.row)">
                <el-switch
                  active-value="0"
                  inactive-value="50"
                  v-model="scope.row.userStatus"
                  active-color="#13ce66"
                ></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="left" prop="userType" label="用户类型">
            <template slot-scope="scope">
              <div>{{CONST.USER_TYPE_MAP[scope.row.userType]}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="left" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column min-width="130px" align="left" prop="corpGroupName" label="操作">
            <template slot-scope="scope">
              <el-button v-show="scope.row.userType!='1'" @click="createOrEditUser(scope.row)">编辑</el-button>
              <el-button @click="info(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>

    <!-- 创建用户 -->
    <create-user
      ref="createUser"
      v-if="showCreateUser"
      :server="server"
      :optionType="optionType"
      :userAccount="userAccount"
      :tenantName="tenantName"
      @closeUserDialog="closeUserDialog"
    ></create-user>

    <!-- 用户详情 -->
    <user-info
      ref="setRole"
      v-if="showUserInfo"
      :server="server"
      :CONST="CONST"
      :userAccount="userAccount"
      @closeUserDialog="closeUserDialog"
    ></user-info>
  </div>
</template>

<script>
import createOrEditUser from './components/createOrEditUser';
import userInfo from './components/userInfo';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'organizeManagement',
  components: {
    'create-user': createOrEditUser,
    'user-info': userInfo,
  },
  data() {
    return {
      server,
      CONST,
      globalOrgId: '',
      userAccount: '',
      loading: false,
      showCreateUser: false,
      showUserInfo: false,
      tenantName: '',
      optionType: 'create',
      initDepartment: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      tenantList: [],
      searchForm: {
        userType: '',
        userStatus: '',
        keyWord: '',
        tenantId: '',
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.server.getAllTenant().then((res) => {
        if (res.code == 200) {
          this.tenantList = res.data;
          this.searchForm.tenantId = this.tenantList.length > 0 ? this.tenantList[0].tenantId : '';
          this.searchList();
        }
      });
    },
    searchList(org) {
      if (org && org.orgId) { // 切换组织
        this.currentPage = 1;
        this.pageSize = 10;
      }
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...this.searchForm,
      };
      this.server.getUserList(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
      });
    },

    // 创建/编辑用户
    createOrEditUser(user) {
      if (user.userAccount) {
        this.optionType = 'edit';
        this.userAccount = user.userAccount;
      } else {
        this.optionType = 'create';
      }
      this.showCreateUser = true;
      this.$nextTick(() => {
        this.$refs.createUser.show();
      });
    },

    //
    info(user) {
      this.userAccount = user.userAccount;
      this.showUserInfo = true;
      this.$nextTick(() => {
        this.$refs.setRole.show();
      });
    },
    // 关闭弹窗
    closeUserDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.getOrgTree();
        this.searchList();
      }
      this.showCreateUser = false;
      this.showUserInfo = false;
    },
    // 批量导入
    batchImport() {

    },
    dataChange(user) {
      this.$confirm('确认更改用户状态？').then(() => {
        this.changeStatus(user);
      });
    },
    changeStatus(user) {
      const params = {
        userName: user.userName, // 用户名称
        userMobile: user.userMobile, // 手机
        userMail: user.userMail, // 邮箱
        userStatus: user.userStatus == '0' ? '50' : '0', // 状态 0有效50：禁用
        orgId: user.orgId, // 用户所在部门ID
        userAccount: user.userAccount,
        userType: 2,
      };
      this.server.updateOrgUser(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('状态更改成功');
          this.searchList();
        }
      });
    },
    // 设置负责人
    setLeader(user) {
      const option = user.tenantLeader == '1' ? 'removeDepartLeder' : 'setDepartLeader';
      const title = user.leader == '1' ? '是否取消部门负责人？' : '是否设置部门负责人?';
      this.$confirm(title).then(() => {
        this.server[option]({ userId: user.userId, roleCode: 'TENANT_ADMIN' }).then((res) => {
          if (res.code == 200) {
            this.searchList();
            this.$message.success('处理成功');
          }
        });
      });
    },
  },
  watch: {
    'searchForm.tenantId': {
      handler(newValue) {
        console.log(newValue);
        this.searchList();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="css">
.search-conditions .el-form {
  display: flex;
  flex-wrap: wrap;
}

.search-conditions .el-form-item {
  margin-right: 20px;
  min-width: 320px;
}
</style>