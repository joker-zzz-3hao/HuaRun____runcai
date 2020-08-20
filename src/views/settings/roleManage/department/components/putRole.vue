<template>
  <el-drawer
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    size="35%"
    :modal="false"
  >
    <div class="modelPut">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色编号" prop="roleCode">
          <el-input
            style="width:320px"
            maxlength="64"
            v-model="form.roleCode"
            placeholder="请输入角色编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            style="width:320px"
            maxlength="64"
            v-model="form.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <div class="menuTreeList">
            <div class="list" v-for="(item,index) in menuTreeList" :key="index">{{item}}</div>
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
              </div>
              <div slot="reference">+</div>
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="submitForm()">确定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
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
    getCheckName() {
      const keys = this.$refs.treeMenu.getCheckedNodes();
      // eslint-disable-next-line array-callback-return
      const keyCheck = keys.map((item) => {
        if (item.children.length == 0) {
          return item.data.functionName;
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
      console.log(this.list);
      this.getCheckName();
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
          functionList: [],
        };
        console.log(res.data.menuTree);
        this.selectArr = res.data.menuTree;
        this.$nextTick(() => {
          this.getCheckName();
        });
      });
    },
    updateRole() {
      const { form } = this;
      form.functionList = this.list.map((item) => ({ functionId: item, roleId: this.roleInfo.roleId }));
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
