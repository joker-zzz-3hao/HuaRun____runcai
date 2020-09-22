<template>
  <div class="tenant-management">
    <div class="operating-area">
      <div class="page-title">用户管理</div>
      <div class="operating-box">
        <el-form :inline="true" class="tl-form-inline" @keyup.enter.native="searchList()">
          <el-form-item>
            <el-select v-model.trim="searchForm.tenantId" placeholder="选择租户" clearable>
              <el-option
                v-for="item in tenantList"
                :key="item.tenantId"
                :label="item.tenantName"
                :value="item.tenantId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model.trim="searchForm.userType"
              placeholder="用户类型"
              clearable
              @change="searchList"
            >
              <el-option
                v-for="item in CONST.USER_TYPE_LIST"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model.trim="searchForm.userStatus"
              placeholder="用户状态"
              clearable
              @change="searchList"
            >
              <el-option
                v-for="item in CONST.USER_STATUS_LIST"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="输入用户姓名/账号/手机号"
              v-model.trim="searchForm.keyWord"
              clearable
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="searchList"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button plain class="tl-btn" @click="searchList">查询</el-button>
        <el-button
          @click="createOrEditUser"
          type="primary"
          icon="el-icon-plus"
          class="tl-btn amt-bg-slip"
        >创建用户</el-button>
        <el-button plain icon="el-icon-minus" class="tl-btn amt-border-slip" @click="batchImport">
          批量导入
          <span class="lines"></span>
        </el-button>
      </div>
    </div>

    <crcloud-table
      :total="total"
      :pageSize.sync="pageSize"
      :currentPage.sync="currentPage"
      @searchList="searchList"
    >
      <div slot="tableContainer">
        <el-table ref="orgTable" v-loading="loading" :data="tableData">
          <el-table-column min-width="100px" align="left" prop="userId" label="用户ID"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userAccount" label="账号/LDAP账号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userName" label="用户姓名"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="userMobile" label="手机号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="tenantName" label="所属租户"></el-table-column>
          <el-table-column min-width="100px" align="left" label="租户管理员">
            <template slot-scope="scope">
              <div style="cursor:pointer" @click="setLeader(scope.row)">
                <el-tooltip class="item" effect="dark" content="租户管理员" placement="top-start">
                  <i v-if="scope.row.tenantLeader == '1'" class="el-icon-user-solid">
                    <span>设置</span>
                  </i>
                </el-tooltip>
                <i v-if="scope.row.tenantLeader=='0'" class="el-icon-user">
                  <span>设置</span>
                </i>
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
                  :active-text="scope.row.userStatus == '0' ? '启用' :'禁用'"
                ></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="left" prop="userType" label="用户类型">
            <template slot-scope="scope">
              <div>{{CONST.USER_TYPE_MAP[scope.row.userType]}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="left" prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <div>{{dateFormat('YYYY-mm-dd HH:MM:SS',new Date(scope.row.createTime) )}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="left" prop="corpGroupName" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.userType=='2'"
                @click="createOrEditUser(scope.row)"
              >编辑</el-button>
              <span v-else>--</span>
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
      :userId="userId"
      :tenantName="tenantName"
      :tenantId="searchForm.tenantId"
      :treeData="treeData"
      @closeUserDialog="closeUserDialog"
    ></create-user>
    <!-- 用户编辑 -->
    <!-- <el-drawer
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :visible.sync="editDrawer"
      v-if="editDrawer"
      title="编辑用户"
      :before-close="closeUserDialog"
    >-->
    <edit-user
      v-if="editDrawer"
      :exist.sync="editDrawer"
      ref="createUser"
      :treeData="treeData"
      :server="server"
      :userId="userId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      @closeUserDialog="closeUserDialog"
    ></edit-user>
    <!-- </el-drawer> -->
  </div>
</template>

<script>
import createUser from './components/createUser';
import editUser from './components/editUser';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'organizeManagement',
  components: {
    'create-user': createUser,
    'edit-user': editUser,
  },
  data() {
    return {
      server,
      CONST,
      globalOrgId: '',
      userId: '',
      loading: false,
      editDrawer: false,
      showCreateUser: false,
      tenantName: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      tenantList: [],
      treeData: [],
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
      this.getOrg();
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
    getOrg() {
      this.server.getOrg({ tenantId: this.searchForm.tenantId }).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        }
      });
    },
    // 创建/编辑用户
    createOrEditUser(user) {
      if (user.userId) {
        this.userId = user.userId;
        this.editDrawer = true;
      } else {
        this.showCreateUser = true;
      }
    },
    // 关闭弹窗
    closeUserDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showCreateUser = false;
      this.editDrawer = false;
    },
    // 批量导入
    batchImport() {

    },
    dataChange(user) {
      // this.$confirm('确认更改用户状态？').then(() => {
      this.changeStatus(user);
      // });
    },
    changeStatus(user) {
      const params = {
        userName: user.userName, // 用户名称
        userMobile: user.userMobile, // 手机
        userMail: user.userMail, // 邮箱
        userStatus: user.userStatus == '0' ? '50' : '0', // 状态 0有效50：禁用
        orgId: user.orgId, // 用户所在部门ID
        userId: user.userId,
        userType: 2,
      };
      this.server.updateOrgUser(params).then((res) => {
        if (res.code == 200) {
          this.searchList();
        }
      });
    },
    // 设置负责人
    setLeader(user) {
      const option = user.tenantLeader == '1' ? 'removeDepartLeder' : 'setDepartLeader';
      const title = user.tenantLeader == '1' ? '是否取消租户管理员？' : '是否设置租户管理员?';
      this.$confirm(title).then(() => {
        this.server[option]({ tenantId: this.searchForm.tenantId, userId: user.userId, roleCode: 'TENANT_ADMIN' }).then((res) => {
          if (res.code == 200) {
            this.searchList();
          }
        });
      });
    },
  },
  watch: {
    'searchForm.tenantId': {
      handler(newValue) {
        this.tenantList.forEach((element) => {
          if (element.tenantId == newValue) {
            this.tenantName = element.tenantName;
          }
        });
        this.searchForm.userType = '';
        this.searchForm.userStatus = '';
        this.searchForm.keyWord = '';
        this.searchList();
        this.getOrg();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>