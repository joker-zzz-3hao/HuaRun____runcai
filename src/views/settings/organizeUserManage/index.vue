<template>
  <div class="organize-management">
    <div class="org-header">
      <div>部门管理</div>
    </div>
    <div class="org-left-side">
      <el-input placeholder="输入用户姓名/手机号" style="width:300px" v-model="filterText">
        <i class="el-icon-search el-input__icon" slot="prefix"></i>
      </el-input>
      <el-tree
        ref="organizeTree"
        :data="treeData"
        node-key="orgId"
        :default-expanded-keys="defaultExpandNode"
        :props="defaultProps"
        @check-change="treeChange"
        @node-click="searchList"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :highlight-current="true"
        :filter-node-method="filterNode"
      ></el-tree>
    </div>
    <div class="org-right-side">
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="searchBar">
          <el-form @keyup.enter.native="searchList()">
            <el-form-item>
              <el-select
                v-model.trim="searchData.userType"
                placeholder="用户类型"
                :popper-append-to-body="false"
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
                v-model.trim="searchData.userStatus"
                placeholder="用户状态"
                :popper-append-to-body="false"
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
                v-model.trim="searchData.keyWord"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="actionBar">
          <div>
            <el-button @click="searchList">查询</el-button>
          </div>
          <div>
            <el-button @click="createDepart">创建部门</el-button>
            <el-button @click="createOrEditUser">创建用户</el-button>
            <el-button @click="batchImport">批量导入</el-button>
          </div>
        </div>
        <div slot="tableContainer">
          <el-table ref="orgTable" v-loading="loading" :data="tableData">
            <el-table-column align="left" width="50" type="index" label="序号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userId" label="用户ID"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userName" label="用户姓名"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userAccount" label="账号/LDAP账号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userMobile" label="手机号"></el-table-column>
            <el-table-column min-width="100px" align="left" label="部门负责人">
              <template slot-scope="scope">
                <div>
                  <el-tooltip class="item" effect="dark" content="部门负责人" placement="top-start">
                    <i
                      v-if="scope.row.leader"
                      class="el-icon-user-solid"
                      @click="setLeader(scope.row)"
                    ></i>
                  </el-tooltip>
                  <i v-if="!scope.row.leader" class="el-icon-user" @click="setLeader(scope.row)"></i>
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
                <el-button v-show="scope.row.userType=='2'" @click="createOrEditUser(scope.row)">编辑</el-button>
                <el-button @click="info(scope.row)">详情</el-button>
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
      :treeData="treeData"
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
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      @closeUserDialog="closeUserDialog"
    ></create-user>
    <el-drawer
      :modal="false"
      :append-to-body="false"
      :visible.sync="editDrawer"
      v-if="editDrawer"
      :with-header="false"
    >
      <edit-user
        ref="createUser"
        :treeData="treeData"
        :server="server"
        :optionType="optionType"
        :userId="userId"
        :tenantName="tenantName"
        :globalOrgId="globalOrgId"
        @closeUserDialog="closeUserDialog"
      ></edit-user>
    </el-drawer>

    <!-- 用户详情 -->
    <user-info
      ref="setRole"
      v-if="showUserInfo"
      :treeData="treeData"
      :server="server"
      :CONST="CONST"
      :userId="userId"
      @closeUserDialog="closeUserDialog"
    ></user-info>
  </div>
</template>

<script>
import createDepart from './components/createDepartment';
import createOrEditUser from './components/createOrEditUser';
import editUser from './components/editUser';
import userInfo from './components/userInfo';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'organizeManagement',
  components: {
    'create-department': createDepart,
    'create-user': createOrEditUser,
    'edit-user': editUser,
    'user-info': userInfo,
  },
  data() {
    return {
      server,
      CONST,
      globalOrgId: '',
      userId: '',
      loading: false,
      editDrawer: false,
      defaultExpandNode: [],
      filterText: '',
      showcreateDepart: false,
      showCreateUser: false,
      showUserInfo: false,
      tenantName: '',
      optionType: 'create',
      initDepartment: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      searchData: {
        userType: '',
        userStatus: '',
        keyWord: '',
      },
      treeData: [{
        orgId: '1',
        orgName: '志任集团',
        orgParentId: '',
        isShow: false,
        sonTree: [
          {
            orgId: '1a',
            orgName: '分公司',
            orgParentId: '1',
            isShow: false,
            sonTree: [
              {
                orgId: '1aa',
                orgName: '分公司11111111111',
                orgParentId: '1a',
                isShow: false,
                sonTree: [
                  {
                    orgId: '1aaa',
                    orgName: '分公司2222222222222',
                    orgParentId: '1aa',
                    isShow: false,
                  },
                ],
              },
            ],
          },
        ],
      }],
      defaultProps: {
        children: 'sonTree',
        label: 'orgName',
      },
    };
  },
  created() {
    this.getOrgTree();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    getOrgTree() {
      this.server.getOrg().then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        }
        this.defaultExpandNode = [this.treeData[0].orgId];
        // this.globalOrgId = this.treeData[0].orgId;
        this.tenantName = this.treeData[0].orgName;
        this.searchList();
      });
    },
    searchList(org) {
      if (org && org.orgId) { // 切换组织
        this.globalOrgId = org.orgId;
        this.currentPage = 1;
        this.pageSize = 10;
      }
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orgId: this.globalOrgId == this.treeData[0].orgId ? '' : this.globalOrgId,
        ...this.searchData,
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
    treeChange() {},
    renderContent(h, {
      node,
      data,
    }) {
      return h('span', {
        style: {},
        // 这里添加hover事件
        on: {
          mouseenter: () => {
            data.isShow = true;
          },
          // 鼠标离开
          mouseleave: () => {
            data.isShow = false;
          },
        },
      }, [
        h('span', {
          // 显示名称
        }, node.label),
        h('span', {
          style: {
            display: data.isShow ? '' : 'none',
          },
        }, [
          // 添加
          // h('i', {
          //   class: 'el-icon-edit',
          // }),
          h('el-button', {
            props: {
              type: 'text',
              size: 'small',
            },
            style: {
              marginLeft: '15px',
            },
            on: {
              click: () => {
                this.createDepart(data);
              },
            },
          }, '创建部门'),
        ]),
      ]);
    },
    // 创建部门
    createDepart(depart) {
      if (depart && depart.orgId) {
        this.initDepartment = depart;
        this.globalOrgId = depart.orgId;
      }
      this.showcreateDepart = true;
      this.$nextTick(() => {
        this.$refs.createDepart.show();
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

    // 设置角色
    info(user) {
      this.userId = user.userId;
      this.showUserInfo = true;
      this.$nextTick(() => {
        this.$refs.setRole.show();
      });
    },
    // 关闭弹窗
    closeOrgDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.getOrgTree();
        this.searchList();
      }
      this.showcreateDepart = false;
      // this.showUserInfo = false;
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
        userId: user.userId,
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
      const option = user.leader ? 'removeDepartLeder' : 'setDepartLeader';
      const title = user.leader ? '是否取消部门负责人？' : '是否设置部门负责人?';
      this.$confirm(title).then(() => {
        this.server[option]({ userId: user.userId, orgId: user.orgId, roleCode: 'ORG_ADMIN' }).then((res) => {
          if (res.code == 200) {
            this.searchList();
            this.$message.success('处理成功');
          }
        });
      });
    },

  },
  watch: {
    filterText(val) {
      this.$refs.organizeTree.filter(val);
    },
  },
};
</script>
<style lang="css">
.org-header {
  height: 100px;
}
.org-left-side {
  width: 600px;
  height: 600px;
}
.org-right-side {
  width: 80%;
  height: 90%;
  position: absolute;
  left: 400px;
}
</style>