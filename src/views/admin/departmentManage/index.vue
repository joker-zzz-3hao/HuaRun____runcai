<template>
  <div class="organize-management">
    <div class="org-header">
      <div>部门管理</div>
      <span>
        <el-button @click="createDepart">创建部门</el-button>
        <el-button @click="createOrEditUser">创建用户</el-button>
        <el-button @click="batchImport">批量导入</el-button>
      </span>
    </div>
    <div class="org-left-side">
      <el-input placeholder="输入用户姓名/手机号" maxlength="50" style="width:300px" v-model="filterText"></el-input>
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
        <div slot="searchBar" class="search-conditions">
          <el-form>
            <el-form-item>
              <el-select v-model.trim="tenantId" placeholder="选择租户">
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
                style="width:300px"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchList">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="tableContainer">
          <el-table ref="orgTable" v-loading="loading" :data="tableData">
            <el-table-column align="left" width="50" type="index" label="序号"></el-table-column>
            <el-table-column min-width="130px" align="left" prop="userId" label="用户ID"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userName" label="用户姓名"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userAccount" label="账号/LDAP账号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="userMobile" label="手机号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="tenantName" label="所属租户"></el-table-column>
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
                <el-button
                  type="text"
                  v-show="scope.row.userType!='1'"
                  @click="createOrEditUser(scope.row)"
                >编辑</el-button>
                <el-button type="text" @click="info(scope.row)">详情</el-button>
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
      :userAccount="userAccount"
      :tenantName="tenantName"
      @createDepart="createDepart"
      @closeUserDialog="closeUserDialog"
    ></create-user>

    <!-- 用户详情 -->
    <user-info
      ref="setRole"
      v-if="showUserInfo"
      :treeData="treeData"
      :server="server"
      :CONST="CONST"
      :userAccount="userAccount"
      @closeUserDialog="closeUserDialog"
    ></user-info>
  </div>
</template>

<script>
import createDepart from './components/createDepartment';
import createOrEditUser from './components/createOrEditUser';
import userInfo from './components/userInfo';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'organizeManagement',
  components: {
    'create-department': createDepart,
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
      defaultExpandNode: [],
      filterText: '',
      showcreateDepart: false,
      showCreateUser: false,
      showUserInfo: false,
      orgId: '',
      tenantId: '',
      tenantName: '',
      optionType: 'create',
      initDepartment: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      tenantList: [],
      searchData: {
        // userType: '',
        // userStatus: '',
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
    this.init();
  },
  methods: {
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
      if (org && org.orgId) { // 切换组织
        this.globalOrgId = org.orgParentId ? org.orgId : '';
        this.currentPage = 1;
        this.pageSize = 10;
        this.tenantId = org.tenantId;
      }
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orgId: this.globalOrgId,
        tenantId: this.tenantId,
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

    // 设置角色
    info(user) {
      this.userAccount = user.userAccount;
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
    setTenantId(orgId) {
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
          tenantId: next.tenantId,
          orgParentId: next.orgParentId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      // 遍历一维数组，设置initDepartment值
      for (const org of result) {
        if (org.orgId == orgId) {
          this.tenantId = org.tenantId;
          this.globalOrgId = org.orgParentId ? org.orgId : '';
        }
      }
    },

  },
  watch: {
    filterText(val) {
      this.$refs.organizeTree.filter(val);
    },
    tenantId: {
      handler(newValue) {
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
  top: 100px;
}
.search-conditions .el-form {
  display: flex;
  flex-wrap: wrap;
}

.search-conditions .el-form-item {
  margin-right: 20px;
  min-width: 320px;
}
</style>