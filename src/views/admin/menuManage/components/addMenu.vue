<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    :destroy-on-close="true"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      :label-position="labelPosition"
    >
      <el-form-item label="上级菜单">
        <!-- <el-input style="width:320px" v-if="parentId" v-model="parentId" placeholder="请输入上级菜单"></el-input> -->
        <!-- <tl-set-menu-option v-show="showOption"></tl-set-menu-option> -->
        <em v-if="menuName">{{menuName}}</em>
        <em v-if="!menuName">主目录</em>
      </el-form-item>
      <el-form-item label="菜单类型" prop="functionType">
        <el-radio-group v-model="form.functionType">
          <el-radio label="PAGE">目录</el-radio>
          <el-radio label="MENU">菜单</el-radio>
          <el-radio label="BTN">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单编码" prop="functionCode">
        <el-input style="width:320px" v-model="form.functionCode" placeholder="请输入菜单编码"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称" prop="functionName">
        <el-input style="width:320px" v-model="form.functionName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="显示排序" prop="functionSequence">
        <el-input
          style="width:320px"
          type="number"
          v-model="form.functionSequence"
          placeholder="请设置示排序"
        ></el-input>
      </el-form-item>
      <el-form-item label="路由地址" prop="resourceUrl">
        <el-input style="width:320px" v-model="form.resourceUrl" placeholder="请输入路由地址"></el-input>
      </el-form-item>
      <el-form-item label="类标识" v-if="form.functionType !=='BTN'" prop="classTag">
        <el-input style="width:320px" v-model="form.classTag" placeholder="请输入类标识"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="permissionCode">
        <el-input style="width:320px" v-model="form.permissionCode" placeholder="请输入权限标识"></el-input>
      </el-form-item>
      <el-form-item label="事件名" v-if="form.functionType !=='BTN'">
        <el-input style="width:320px" v-model="form.functionEvent" placeholder="请输入事件名"></el-input>
      </el-form-item>
      <!-- <el-form-item label="icon" v-if="form.functionType =='PAGE'" prop="icon">
        <el-input style="width:320px" v-model="form.icon" placeholder="请输入icon名称"></el-input>
      </el-form-item>
      <el-form-item label="标题名称" v-if="form.functionType =='PAGE'" prop="title">
        <el-input style="width:320px" v-model="form.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>-->
      <el-form-item
        label="菜单状态"
        v-if="form.functionType=='MENU'||form.functionType=='PAGE'"
        prop="status"
      >
        <el-radio-group v-model="form.status">
          <el-radio label="Y">正常</el-radio>
          <el-radio label="N">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="validateForm">确定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>

import Server from '../server';

const server = new Server();
export default {
  name: 'addMenu',
  props: {
    title: {
      type: String,
      required: true,
    },
    parentId: {
      type: [Number, String],
      required: false,
    },
    menuName: {
      type: String,
      required: false,
    },
    menuData: {
      type: [Object, String],
      required: false,
    },
  },
  data() {
    return {
      labelPosition: 'left',
      server,
      showOption: false,
      form: {
        functionType: 'PAGE',
        status: 'Y',
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      rules: {
        functionCode: [{ required: true, message: '请输入菜单编码', trigger: 'change' },
        ],
        classTag: [{ required: true, message: '请输入类标识', trigger: 'blur' },
        ],
        functionName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '请输入中文或者字母',
            trigger: 'blur',
          }],
        functionSequence: [{ required: true, message: '请设置示排序', trigger: 'blur' },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur',
          },
        ],
        permissionCode: [{ required: true, message: '请输入权限标识', trigger: 'blur' },
          // {
          //   pattern: /^[0-9a-zA-Z]+$/,
          //   message: '请输入数字或者英文字母',
          //   trigger: 'blur',
          // }
        ],
        resourceUrl: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        functionEvent: [
          { required: true, message: '请输入事件名', trigger: 'blur' },
        ],
        icon: [
          { required: true, message: '请输入icon名称', trigger: 'blur' },
        ],
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
        ],
      },
    };
  },

  mounted() {
    this.dialogTableVisible = true;
    if (this.menuData) {
      this.form = this.menuData;
    }
  },
  methods: {
    submitForm() {
      const { form } = this;
      form.parentId = this.parentId;

      if (form.functionType == 'BTN') {
        form.classTag = '';
        form.functionEvent = '';
      }
      this.server.addOrUpdate(form).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit('getMenuList');
          this.closed();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    validateForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitForm();
        } else {
          return false;
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
</style>