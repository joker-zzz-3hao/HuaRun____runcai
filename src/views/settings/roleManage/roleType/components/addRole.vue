<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      :label-position="labelPosition"
    >
      <el-form-item label="角色编号" prop="roleCode">
        <el-input style="width:320px" maxlength="64" v-model="form.roleCode" placeholder="请输入角色编号"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input style="width:320px" maxlength="64" v-model="form.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" v-if="!rouleType">
        <div class="menuTreeList">
          <div class="list" v-for="(item,index) in menuTreeList" :key="index">
            <span>{{item.data.functionName}}</span>
            <i class="el-icon-error" @click.stop="clearNode(item)"></i>
          </div>
          <el-popover placement="bottom" trigger="click">
            <div class="postMenu">
              <el-cascader-panel
                @change="handleCheckChange"
                ref="treeMenu"
                v-model="selectArr"
                :options="data"
                :props="{ multiple: true,value:'functionId',children:'children',label:'functionName' }"
                node-key="id"
              ></el-cascader-panel>
            </div>
            <div slot="reference">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
          </el-popover>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm()">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'home',
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
      server,
      labelPosition: 'left',
      menuTreeList: [],
      selectArr: [],
      list: [],
      showMenu: false,
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
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: '请输入数字或者英文字母',
            trigger: 'blur',
          },
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
      let arr = [];
      data.forEach((item) => {
        arr = arr.concat(item);
      });
      this.list = Array.from(new Set(arr));
      this.getCheckName();
    },
    getqueryMenu() {
      this.server.listTenantFuncation()
        .then((res) => {
          this.data = res.data;
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.addRole();
        } else {
          return false;
        }
      });
    },
    addRole() {
      const { form } = this;
      this.form.functionList = this.list.map((item) => ({ functionId: item }));
      form.roleType = 'CREATION';
      this.server.addRole(form).then((res) => {
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
<style  scoped>
.addRoule {
  position: relative;
}
.roulemember {
  width: 100%;
  z-index: 99999999;
  position: absolute;
  left: 0;
  top: 50px;
  padding: 25px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.menuTreeList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.menuTreeList .list {
  background: #f4f6f8;
  border-radius: 14px;
  padding: 1px 10px;
}
</style>
