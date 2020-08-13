<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 18:02:57
 * @Description: file content
-->
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
    center
  >
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="上级菜单">
        <!-- <el-input style="width:320px" v-if="parentId" v-model="parentId" placeholder="请输入上级菜单"></el-input> -->
        <!-- <tl-set-menu-option v-show="showOption"></tl-set-menu-option> -->
        <span v-if="menuName">{{menuName}}</span>
        <span v-if="!menuName">主目录</span>
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="form.functionType">
          <el-radio label="PAGE">目录</el-radio>
          <el-radio label="MENU">菜单</el-radio>
          <el-radio label="BTN">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单编码">
        <el-input style="width:320px" v-model="form.functionCode" placeholder="请输入菜单编码"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称">
        <el-input style="width:320px" v-model="form.functionName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="显示排序">
        <el-input
          style="width:320px"
          type="number"
          v-model="form.functionSequence"
          placeholder="请设置示排序"
        ></el-input>
      </el-form-item>
      <el-form-item label="路由地址" v-if="form.functionType!='BTN'">
        <el-input style="width:320px" v-model="form.permissionCode" placeholder="请输入路由地址"></el-input>
      </el-form-item>
      <el-form-item label="组件路径" v-if="form.functionType=='MENU'">
        <el-input style="width:320px" v-model="form.resourceUrl" placeholder="请输入组件路径"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" v-if="form.functionType=='BTN'||form.functionType=='MENU'">
        <el-input style="width:320px" v-model="form.permissionCode" placeholder="请输入权限标识"></el-input>
      </el-form-item>
      <el-form-item label="菜单状态" v-if="form.functionType=='MENU'||form.functionType=='PAGE'">
        <el-radio-group v-model="form.status">
          <el-radio label="O">正常</el-radio>
          <el-radio label="S">停用</el-radio>
        </el-radio-group>
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
    parentId: {
      type: Number,
      required: false,
    },
    menuName: {
      type: String,
      required: false,
    },
    menuData: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      server,
      showOption: false,
      form: {},
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
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