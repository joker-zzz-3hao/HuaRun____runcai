<template>
  <el-drawer
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :append-to-body="true"
    :title="title"
    :modal="false"
    :visible.sync="dialogTableVisible"
    class="tl-drawer tl-drawer-tenant-edit"
  >
    <div class="modelCreate">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="租户名称" prop="tenantName">
          <span>{{ form.tenantName }}</span>
        </el-form-item>
        <el-form-item label="企业ID" prop="tenantId">
          <span>{{ form.tenantId }}</span>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-input
            class="tl-input input-width"
            maxlength="64"
            v-model="form.applyUser"
            placeholder="请输入申请人"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobilePhone">
          <el-input
            v-model="form.mobilePhone"
            placeholder="请输入联系电话"
            class="tl-input input-width"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="开放菜单功能">
          <div class="menuTreeList">
            <div class="postMenu">
              <el-tree
                @check-change="handleCheckChange"
                ref="treeMenu"
                show-checkbox
                :data="data"
                :props="{
                  label: 'functionName',
                  id: 'functionId',
                  children: 'children',
                }"
                node-key="functionId"
              ></el-tree>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button
        type="primary"
        @click="validateForm('form')"
        class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button @click="close" class="tl-btn amt-border-fadeout"
        >取 消</el-button
      >
    </div>
  </el-drawer>
</template>
<script>

import Server from '../server';

const server = new Server();

export default {
  name: 'createTenant',
  props: {
    title: {
      type: String,
      required: true,
    },
    tenantId: {
      type: [String, Number],
      required: false,
    },
    infoBool: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      postMenu: false,
      server,
      visible: false,
      showMenu: false,
      selectArr: [],
      menuTreeList: [],
      form: {
        tenantName: '',
        applyUser: '',
        mobilePhone: '',
        tenantId: '',
        date: '',
        status: 'O',
        startTime: '',
        endTime: '',

      },

      rules: {
        tenantName: [{ required: true, message: '请输入租户名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '请输入中文或者字母',
            trigger: 'blur',
          },

        ],
        applyUser: [{ required: true, message: '请输入申请人名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '请输入中文或者字母',
            trigger: 'blur',
          },
        ],
        tenantId: [{
          required: true, message: '请输入企业ID', trigger: 'blur',
        },
        ],
        mobilePhone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur',
          },
        ],

      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      list: [],
      selectList: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    // 判断租户ID存在请求租户详情接口
    this.getqueryMenu();
  },
  methods: {

    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = res.data;
          this.getTenant();
        });
    },

    // 获取租户信息
    getTenant() {
      this.server.getTenant({ tenantId: this.tenantId })
        .then((res) => {
          this.form.tenantName = res.data.tenantName;
          this.form.applyUser = res.data.applyUser;
          this.form.mobilePhone = res.data.mobilePhone;
          this.form.tenantId = res.data.tenantId;
          this.form.status = res.data.status;
          this.list = res.data.menuItems;
          this.$nextTick(() => {
            this.$refs.treeMenu.setCheckedKeys(res.data.menuItems);
          });
        });
    },

    // 校验数据填写格式
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.pudateForm();
        } else {
          return false;
        }
      });
    },
    // 获取选中tree key值 展示选中
    handleCheckChange() {
      this.list = this.$refs.treeMenu.getCheckedKeys();
    },
    // 提交编辑数据
    pudateForm() {
      this.form.menuTree = this.list.map((item) => ({ functionId: item }));
      this.server.updateTenant({
        tenantName: this.form.tenantName,
        tenantId: this.form.tenantId,
        applyUser: this.form.applyUser,
        mobilePhone: this.form.mobilePhone,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        status: this.form.status,
        menuTree: this.form.menuTree,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$emit('getTenantList');
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
  },

};
</script>
<style  >
.modelCreate {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 620px;
}
.tl-drawer-tenant-edit .el-drawer {
  width: 500px !important;
}
.input-width {
  width: 90%;
}
</style>
