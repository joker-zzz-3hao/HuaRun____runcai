<template>
  <el-dialog
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :append-to-body="true"
    :title="title"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      class="tl-form"
    >
      <el-form-item label="租户名称" prop="tenantName">
        <el-input
          v-model="form.tenantName"
          maxlength="64"
          class="tl-input"
          placeholder="请输入租户名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="企业ID" prop="tenantId">
        <el-input
          maxlength="64"
          class="tl-input"
          v-model="form.tenantId"
          placeholder="请输入企业ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-input
          maxlength="64"
          class="tl-input"
          v-model="form.applyUser"
          placeholder="请输入申请人"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobilePhone">
        <el-input
          v-model="form.mobilePhone"
          class="tl-input"
          placeholder="请输入联系电话"
          maxlength="13"
        ></el-input>
      </el-form-item>
      <el-form-item label="开放菜单功能">
        <div class="menuTreeList">
          <div class="list" v-for="(item, index) in menuTreeList" :key="index">
            <span>{{ item.data.functionName }}</span>
            <i class="el-icon-error" @click.stop="clearNode(item)"></i>
          </div>
          <div>
            <el-tree
              @check-change="handleCheckChange"
              ref="treeMenu"
              :data="data"
              show-checkbox
              :props="{
                multiple: true,
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
    <div slot="footer" class="dialog-footer">
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
  </el-dialog>
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
      list: [],
      postMenu: false,
      menuTreeList: [],
      server,
      showMenu: false,
      selectList: [],
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
            message: '仅支持输入中文或者字母',
            trigger: 'blur',
          },

        ],
        applyUser: [{ required: true, message: '请输入申请人名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '仅支持输入中文或者字母',
            trigger: 'blur',
          },
        ],
        tenantId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback('请输入企业ID');
              } else if (!/^\w+$/.test(value)) {
                callback('只支持数字、字母和下划线');
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
          {
            pattern: /[^\u4E00-\u9FA5]/g,
            message: '不允许输入汉字',
            trigger: 'blur',
          },
        ],
        mobilePhone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback('请输入手机号');
              } else if (!(/^[1][3456789][0-9]{9}$/
                .test(value) || /^[0][1-9]{2,3}-[0-9]{5,10}$/.test(value))) {
                callback('联系电话格式不正确,示例0596-12345678');
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      selectArr: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;

    this.getqueryMenu();
  },
  methods: {
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = res.data;
        });
    },
    // 校验数据填写格式
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.creatForm();
        } else {
          return false;
        }
      });
    },
    // 获取选中tree key值 展示选中
    handleCheckChange() {
      this.list = this.$refs.treeMenu.getCheckedKeys();
    },
    // 提交创建数据
    creatForm() {
      this.form.menuTree = this.list.map((item) => ({ functionId: item }));
      this.server.insertTenant({
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
            this.$message.success('创建成功');
            this.closed();
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
