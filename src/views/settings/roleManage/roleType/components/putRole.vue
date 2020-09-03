<template>
  <el-drawer
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    :modal="false"
    :wrapperClosable="false"
    class="tl-drawer"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="tl-form">
      <el-form-item label="角色编号" prop="roleCode">
        <em>{{form.roleCode}}</em>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input maxlength="64" v-model="form.roleName" placeholder="请输入角色名称" class="tl-input"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限">
        <div class="menuTreeList">
          <div class="list" v-for="(item,index) in menuTreeList" :key="index">
            <span>{{item.data.functionName}}</span>
            <i class="el-icon-error" @click.stop="clearNode(item)"></i>
          </div>
          <el-popover placement="bottom-end" trigger="click">
            <div class="postMenu">
              <el-cascader-panel
                @change="handleCheckChange"
                ref="treeMenu"
                v-model="selectArr"
                :options="data"
                :props="{ multiple: true, value:'functionId', label:'functionName',children:'children' }"
                node-key="id"
              ></el-cascader-panel>
              <div>
                <el-button type="text" @click="saveTree">确认</el-button>
                <el-button type="text" @click="clearNodeAll">清空</el-button>
              </div>
            </div>
            <div slot="reference">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
          </el-popover>
        </div>
      </el-form-item>
    </el-form>
    <div class="operating-box">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip">保存</el-button>
      <el-button plain @click="close" class="tl-btn amt-border-fadeout">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'putRole',
  props: {
    title: {
      type: String,
      required: true,
    },
    rouleType: {
      type: Boolean,
      required: true,
    },
    roleInfo: {
      type: [Object, String],
      required: false,
    },
  },
  data() {
    return {
      list: [],
      server,
      menuTreeList: [],
      selectArr: [],
      showMenu: false,
      selectList: [],
      form: {
        roleCode: '',
        roleName: '',
        functionList: [],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '只允许输入中文或者字母',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  mounted() {
    this.dialogTableVisible = true;

    this.getqueryMenu();
  },
  methods: {
    saveTree() {
      const keys = this.$refs.treeMenu.getCheckedNodes();
      // eslint-disable-next-line array-callback-return
      const keyCheck = keys.map((item) => {
        if (item.children.length == 0) {
          return item;
        }
      });
      // eslint-disable-next-line array-callback-return
      this.menuTreeList = keyCheck.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.selectList = this.list;
    },
    clearNode(node) {
      const deleteArr = this.selectArr;
      deleteArr.forEach((item, index) => {
        if (this.boolCheck(item, node)) {
          deleteArr.splice(index, 1);
        }
      });
      this.selectArr = [...deleteArr, []];
      let arr = [];
      this.selectArr.forEach((item) => {
        arr = arr.concat(item);
      });
      this.list = Array.from(new Set(arr));

      this.$nextTick(() => {
        const keys = this.$refs.treeMenu.getCheckedNodes();
        // eslint-disable-next-line array-callback-return
        const keyCheck = keys.map((item) => {
          if (item.children.length == 0) {
            return item;
          }
        });
        // eslint-disable-next-line array-callback-return
        this.menuTreeList = keyCheck.filter((item) => {
          if (item) {
            return item;
          }
        });
      });
      this.selectList = this.list;
    },
    boolCheck(item, node) {
      return item.some((li) => li === node.data.functionId);
    },
    getCheckName() {
      const keys = this.$refs.treeMenu.getCheckedNodes();
      // eslint-disable-next-line array-callback-return
      const keyCheck = keys.map((item) => {
        if (item.children.length == 0) {
          return item;
        }
      });
      // eslint-disable-next-line array-callback-return
      this.menuTreeList = keyCheck.filter((item) => {
        if (item) {
          return item;
        }
      });
    },
    handleCheckChange(data) {
      console.log(data);
      let arr = [];
      data.forEach((item) => {
        arr = arr.concat(item);
      });
      this.list = Array.from(new Set(arr));
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.listTenantFuncation()
        .then((res) => {
          this.data = res.data;
          this.getRole();
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateRole();
        } else {
          return false;
        }
      });
    },
    getRole() {
      this.server.getRole({
        roleId: this.roleInfo.roleId,
        roleCode: this.roleInfo.roleCode,
      }).then((res) => {
        this.form = {
          roleCode: res.data.roleCode,
          roleName: res.data.roleName,
        };
        console.log(res.data.menuTree);
        this.selectArr = res.data.menuTree;
        this.$nextTick(() => {
          this.getCheckName();
          let arr = [];
          this.selectArr.forEach((item) => {
            arr = arr.concat(item);
          });
          this.selectList = Array.from(new Set(arr));
        });
      });
    },
    updateRole() {
      const { form } = this;
      form.functionList = this.selectList.map((item) => ({ functionId: item, roleId: this.roleInfo.roleId }));
      form.roleType = 'CREATION';
      form.roleId = this.roleInfo.roleId;
      this.server.updateRole(form).then((res) => {
        if (res.code == 200) {
          this.$emit('getSearchList');
          this.$message.success(res.msg);
          this.closed();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
    },
    closeshowMember() {
      this.dialogVisible = false;
    },
  },
};
</script>