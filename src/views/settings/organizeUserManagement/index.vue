<template>
  <div class="organize-management">
    <div>
      <h5>组织管理</h5>
      <el-button @click="createDepart">创建部门</el-button>
      <el-button @click="createOrEditUser">创建用户</el-button>
      <el-button @click="batchImport">批量导入</el-button>
    </div>
    <div class="left-tree">
      <el-input placeholder="输入用户姓名/手机号" style="width:300px"></el-input>
      <el-tree
        ref="organizeTree"
        :data="treeData"
        node-key="id"
        :default-expanded-keys="['0']"
        :props="defaultProps"
        @check-change="treeChange"
        :expand-on-click-node="false"
        :render-content="renderContent"
      ></el-tree>
    </div>
    <div class="right-table">
      <span>润联软件系统（深圳）有限公司（961人）</span>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer">
          <el-table ref="orgTable" v-loading="loading" :data="tableData">
            <el-table-column align="left" width="100" type="index" label="序号"></el-table-column>
            <el-table-column min-width="100px" prop="bizName" align="left" label="账号/LDAP账号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="corpGroupName" label="姓名"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="corpGroupName" label="手机号"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="corpGroupName" label="用户类型"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="corpGroupName" label="用户状态"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="corpGroupName" label="操作">
              <template slot-scope="scope">
                <el-button @click="setting(scope.row)">角色设置</el-button>
                <el-button @click="createOrEditUser(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <create-department
      ref="createDepart"
      v-if="showcreateDepart"
      :treeData="childrenData"
      @closeDepartDialog="closeDepartDialog"
    ></create-department>
  </div>
</template>

<script>
import createDepart from './components/createDepartment';

export default {
  name: 'organizeManagement',
  components: {
    'create-department': createDepart,
  },
  data() {
    return {
      loading: false,
      showcreateDepart: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      treeData: [],
      childrenData: [{
        id: '0',
        label: '华润云',
        is_show: false,
        children: [{
          id: '01',
          label: '云门户',
          is_show: false,
        }],
      }, {
        id: '1',
        label: 'IT产品服务部',
        is_show: false,
        children: [{
          id: '11',
          label: '润工作',
          is_show: false,
        }],
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  created() {
    this.treeData = [
      {
        id: 'admin',
        label: '润联软件系统（深圳）有限公司',
        children: this.childrenData,
      },
    ];
  },
  methods: {
    searchList() {

    },
    treeChange() {},
    renderContent(h, {
      node,
      data,
    }) {
      return h('span', {
        style: {
          // color: 'red',
        },
        // 这里添加hover事件
        on: {
          mouseenter: () => {
            data.is_show = true;
          },
          // 鼠标离开
          mouseleave: () => {
            data.is_show = false;
          },
        },
      }, [
        h('span', {
          // 显示名称
        }, node.label),
        h('span', {
          style: {
            display: data.is_show ? '' : 'none',
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
                this.setLeader(data);
              },
            },
          }, '设置负责人'),

        ]),
      ]);
    },
    // 创建部门
    createDepart(depart) {
      this.showcreateDepart = true;
      this.$nextTick(() => {
        this.$refs.createDepart.show(depart);
      });
    },
    closeDepartDialog() {
      this.showcreateDepart = false;
    },
    // 设置负责人
    setLeader(data) {
      console.log(data);
    },
    // 创建/编辑用户
    createOrEditUser() {

    },
    // 批量导入
    batchImport() {

    },
    setRole() {

    },

  },
};
</script>