<template>
  <div class="organize-management">
    <div class="operating-area">
      <div class="page-title">组织管理</div>
      <div class="operating-box">
        <div class="flex-auto">
          <el-form @keyup.enter.native="searchList()" class="tl-form">
            <el-form-item>
              <el-select
                v-model.trim="tenantId"
                placeholder="选择租户"
                :popper-append-to-body="false"
                clearable
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in tenantList"
                  :key="item.tenantId"
                  :label="item.tenantName"
                  :value="item.tenantId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="输入用户姓名/账号/手机号"
                v-model.trim="searchData.keyWord"
                clearable
                class="tl-input"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button plain class="tl-btn" @click="searchList">查询</el-button>
        </div>
        <div class="operating-right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="tl-btn amt-bg-slip"
            @click="createDepart"
          >创建部门</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="tl-btn amt-bg-slip"
            @click="createOrEditUser"
          >创建用户</el-button>
          <el-button plain icon="el-icon-minus" class="tl-btn amt-border-slip" @click="batchImport">
            批量导入
            <span class="lines"></span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="cont-area">
      <div class="department-tree">
        <el-input placeholder="输入部门名称" v-model.trim="filterText" clearable class="tl-input">
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
        <el-tree
          ref="organizeTree"
          :data="treeData"
          node-key="orgId"
          :default-expanded-keys="defaultExpandNode"
          :props="defaultProps"
          @node-click="searchList"
          :expand-on-click-node="true"
          :highlight-current="true"
          :filter-node-method="filterNode"
          class="tl-tree"
        >
          <div class="tree-title" slot-scope="{ node, data }">
            <em>{{ node.label }}</em>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="createDepart(data)" command="1">创建部门</el-dropdown-item>
                <el-dropdown-item @click.native="updateDepart(data)">编辑部门</el-dropdown-item>
                <el-dropdown-item @click.native="deleteDepart(data)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table ref="orgTable" v-loading="loading" :data="tableData" class="tl-table">
            <el-table-column min-width="200px" align="left" prop="userId" label="用户ID"></el-table-column>
            <el-table-column min-width="150px" align="left" prop="userName" label="用户姓名"></el-table-column>
            <el-table-column min-width="150px" align="left" prop="userAccount" label="账号/LDAP账号"></el-table-column>
            <el-table-column min-width="120px" align="left" prop="userMobile" label="手机号"></el-table-column>
            <el-table-column min-width="120px" align="left" prop="tenantName" label="所属租户"></el-table-column>
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
                <div>{{scope.row.createTime ? dateFormat('YYYY-mm-dd HH:MM:SS',new Date(scope.row.createTime) ):'--'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              width="100px"
              align="left"
              prop="corpGroupName"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.userType=='2'"
                  @click="createOrEditUser(scope.row)"
                  class="tl-btn"
                >编辑</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.userType=='2'"
                  @click="info(scope.row)"
                  class="tl-btn"
                >详情</el-button>
                <div v-else>--</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <!-- 创建部门 -->
    <create-department
      ref="createDepart"
      v-if="showcreateDepart"
      :tenantId="tenantId"
      :treeData="treeData"
      :departOptionType="departOptionType"
      :initDepartment="initDepartment"
      :server="server"
      @closeOrgDialog="closeOrgDialog"
    ></create-department>
    <!-- 创建用户 -->
    <create-user
      ref="createUser"
      v-if="showCreateUser"
      :treeData="treeData"
      :server="server"
      :optionType="optionType"
      :userId="userId"
      :tenantId="tenantId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      @closeUserDialog="closeUserDialog"
    ></create-user>
    <!-- 编辑用户 -->
    <tl-edit-user
      v-if="editDrawer"
      :exist.sync="editDrawer"
      :server="server"
      :userId="userId"
      :tenantId="tenantId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      :optionType="optionType"
      :treeData="treeData"
      @closeUserDialog="closeUserDialog"
    ></tl-edit-user>
    <!-- 查看用户详情 -->
    <tl-user-info
      v-if="infoDrawer"
      :exist.sync="infoDrawer"
      :server="server"
      :userId="userId"
      :tenantId="tenantId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      :optionType="optionType"
      :treeData="treeData"
      @closeUserDialog="closeUserDialog"
    ></tl-user-info>
  </div>
</template>

<script>
import createDepart from './components/createDepartment';
import createUser from './components/createUser';
import editUser from './components/editUser';
import info from './components/info';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'organizeManagement',
  components: {
    'create-department': createDepart,
    'create-user': createUser,
    'tl-edit-user': editUser,
    'tl-user-info': info,
  },
  data() {
    return {
      exist: false,
      server,
      CONST,
      globalOrgId: '',
      userId: '',
      loading: false,
      editDrawer: false,
      infoDrawer: false,
      showOrg: false,
      defaultExpandNode: [],
      tenantList: [],
      filterText: '',
      showcreateDepart: false,
      showCreateUser: false,
      tenantId: '',
      tenantName: '',
      orgFullId: '',
      orgIdList: [],
      optionType: 'create',
      departOptionType: 'create',
      initDepartment: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      searchData: {
        keyWord: '',
      },
      treeData: [],
      defaultProps: {
        children: 'sonTree',
        label: 'orgName',
        orgId: 'orgId',
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    showAddRoule() {
      this.exist = true;
    },
    init() {
      this.server.getAllTenant().then((res) => {
        if (res.code == 200) {
          this.tenantList = res.data;
          this.tenantId = this.tenantList.length > 0 ? this.tenantList[0].tenantId : '';
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    getOrgTree() {
      this.server.getOrg({ tenantId: this.tenantId }).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        }
        this.searchList();
      });
    },
    searchList(org) {
      if (org && org.orgId) { // 切换部门
        this.globalOrgId = org.orgId;
        this.searchData.keyWord = '';
        this.tenantId = org.tenantId;
        this.currentPage = 1;
        this.pageSize = 10;
      }
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orgId: this.globalOrgId,
        tenantId: this.tenantId,
        keyWord: this.searchData.keyWord,
      };
      this.server.getUserListByOrgId(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
      });
    },
    setOrgIdList(orgId) {
      // 遍历嵌套数组，转换为一维数组
      const queue = [...this.treeData];
      const result = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        result.push({
          orgId: next.orgId,
          orgName: next.orgName,
          orgParentId: next.orgParentId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      this.orgIdList = [];
      this.getOrgIdList(result, orgId);
      this.orgIdList.reverse();
    },
    getOrgIdList(result, orgId) {
      let orgParentId = '';
      for (const org of result) {
        if (org.orgId == orgId) {
          orgParentId = org.orgParentId;
          this.orgIdList.push(org.orgId);
          this.getOrgIdList(result, orgParentId);
        }
      }
    },
    // 创建部门
    createDepart(depart) {
      this.departOptionType = 'create';
      if (depart && depart.orgId) {
        this.initDepartment = depart;
        this.globalOrgId = depart.orgId;
      }
      if (this.treeData.length > 0) {
        this.showcreateDepart = true;
        this.$nextTick(() => {
          this.$refs.createDepart.show();
        });
      }
    },
    updateDepart(depart) {
      this.departOptionType = 'edit';
      depart.isShow = false;
      if (depart && depart.orgId) {
        this.initDepartment = depart;
        this.globalOrgId = depart.orgId;
      }
      this.showcreateDepart = true;
      this.$nextTick(() => {
        this.$refs.createDepart.show(depart);
      });
    },
    deleteDepart(depart) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该数据，删除将无法恢复',

      }).then(() => {
        this.server.updateOrg({ orgId: depart.orgId, orgAvailable: 1 }).then((res) => {
          if (res.code == 200) {
            this.$message.success('部门删除成功');
            this.getOrgTree();
          }
        });
      });
    },
    // 创建/编辑用户
    createOrEditUser(user) {
      if (user.userId) {
        this.optionType = 'edit';
        this.userId = user.userId;
        this.editDrawer = true;
      } else {
        this.optionType = 'create';
        this.showCreateUser = true;
        this.$nextTick(() => {
          this.$refs.createUser.show();
        });
      }
    },
    // 查看详情
    info(user) {
      if (user.userId) {
        this.userId = user.userId;
        this.infoDrawer = true;
      }
    },
    // 关闭弹窗
    closeOrgDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.getOrgTree();
        this.searchList();
      }
      this.showcreateDepart = false;
    },
    closeOrg() {
      this.showOrg = false;
    },
    // 关闭弹窗
    closeUserDialog(data) {
      // 需要刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showCreateUser = false;
      this.editDrawer = false;
      this.infoDrawer = false;
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
      const option = user.leader ? 'removeDepartLeder' : 'setDepartLeader';
      const title = user.leader ? `是否取消部门负责人${user.userName}?` : `是否设置${user.userName}为部门负责人？`;
      this.$confirm(title).then(() => {
        this.server[option]({
          tenantId: user.tenantId, userId: user.userId, orgId: user.leader ? user.leader : user.orgId, roleCode: 'ORG_ADMIN',
        }).then((res) => {
          if (res.code == 200) {
            this.searchList();
          }
        });
      });
    },
    createLeader(user) {
      console.log(user);
      this.server.setDepartLeader({
        tenantId: this.tenantId, userId: user.userId, orgId: user.orgId, roleCode: 'ORG_ADMIN',
      }).then((res) => {
        if (res.code == 200) {
          this.searchList();
        }
      });
    },
    hoverDepart(depart) {
      depart.isShow = true;
    },
    outDepart(depart) {
      depart.isShow = false;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.organizeTree.filter(val);
    },
    tenantId: {
      handler(newValue) {
        this.globalOrgId = '';
        this.tenantId = newValue;
        this.tenantList.forEach((element) => {
          if (element.tenantId == newValue) {
            this.tenantName = element.tenantName;
          }
        });
        this.getOrgTree();
      },
    },
  },
};
</script>