<template>
  <div class="organize-management">
    <div class="org-header">
      <div>组织管理</div>
    </div>
    <div class="org-left-side">
      <el-input placeholder="输入部门名称" style="width:300px" v-model="filterText">
        <i class="el-icon-search el-input__icon" slot="prefix"></i>
      </el-input>
      <el-tree
        ref="organizeTree"
        :data="treeData"
        node-key="orgId"
        :default-expanded-keys="defaultExpandNode"
        :props="defaultProps"
        @node-click="searchList"
        :expand-on-click-node="false"
        :highlight-current="true"
        :filter-node-method="filterNode"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <i @click="hoverDepart(data)" style="marginLeft:150px" class="el-icon-more"></i>
            <div @mouseleave="outDepart(data)" v-show="data.isShow">
              <div style="marginLeft:250px" @click="createDepart(data)">创建部门</div>
              <div style="marginLeft:250px" @click="updateDepart(data)">编辑部门</div>
              <div style="marginLeft:250px" @click="deleteDepart(data)">删除</div>
            </div>
          </span>
        </span>
      </el-tree>
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
            <el-table-column min-width="100px" align="left" prop="userId" label="用户ID"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userName" label="用户姓名"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userAccount" label="账号/LDAP账号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userMobile" label="手机号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="orgName" label="所属部门"></el-table-column>
            <el-table-column min-width="100px" align="left" label="部门负责人">
              <template slot-scope="scope">
                <div @click="setLeader(scope.row)" style="cursor: pointer;">
                  <el-tooltip class="item" effect="dark" content="部门负责人" placement="top-start">
                    <i v-if="scope.row.leader" class="el-icon-user-solid">
                      <span>设置</span>
                    </i>
                  </el-tooltip>
                  <i v-if="!scope.row.leader" class="el-icon-user">
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
            <el-table-column min-width="120px" align="left" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column min-width="130px" align="left" prop="corpGroupName" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.userType=='2'"
                  @click="createOrEditUser(scope.row)"
                >编辑</el-button>
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
      :departOptionType="departOptionType"
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
      title="编辑用户"
      :before-close="closeUserDialog"
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
  </div>
</template>

<script>
import createDepart from './components/createDepartment';
import createUser from './components/createUser';
import editUser from './components/editUser';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'organizeManagement',
  components: {
    'create-department': createDepart,
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
      defaultExpandNode: [],
      filterText: '',
      showcreateDepart: false,
      showCreateUser: false,
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
        userType: '',
        userStatus: '',
        keyWord: '',
      },
      treeData: [],
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
        this.globalOrgId = this.treeData[0].orgId;
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
      this.setOrgIdList(this.globalOrgId);
      this.orgFullId = this.orgIdList.join(':');
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        // orgId: this.globalOrgId,
        orgFullId: this.orgFullId,
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
      depart.isShow = false;
      if (depart && depart.orgId) {
        this.initDepartment = depart;
        this.globalOrgId = depart.orgId;
      }
      this.showcreateDepart = true;
      this.$nextTick(() => {
        this.$refs.createDepart.show();
      });
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
        this.server.deleteDepart({ orgId: depart.orgId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('部门删除成功');
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
    // 关闭弹窗
    closeOrgDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.getOrgTree();
        this.searchList();
      }
      this.showcreateDepart = false;
    },
    // 关闭弹窗
    closeUserDialog(data) {
      // 需要刷新页面;
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
      const option = user.leader ? 'removeDepartLeder' : 'setDepartLeader';
      const title = user.leader ? `是否取消部门负责人${user.userName}?` : `是否设置${user.userName}为部门负责人？`;
      this.$confirm(title).then(() => {
        this.server[option]({ userId: user.userId, orgId: user.orgId, roleCode: 'ORG_ADMIN' }).then((res) => {
          if (res.code == 200) {
            this.searchList();
          }
        });
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
  },
};
</script>
<style lang="css">
.org-header {
  height: 100px;
}
.org-left-side {
  width: 400px;
  height: 600px;
}
.org-right-side {
  width: 80%;
  height: 90%;
  position: absolute;
  left: 400px;
}
</style>