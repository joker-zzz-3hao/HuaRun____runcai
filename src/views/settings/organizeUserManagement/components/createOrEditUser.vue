<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog :visible="visible" @close="close" title="创建用户" :close-on-click-modal="false">
      <el-form ref="userForm" :model="formData">
        <el-form-item label="用户名称" prop="departName">
          <el-input v-model.trim="formData.departName"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="parentDepart">
          <el-input v-model.trim="formData.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="sortIndex">
          <el-input v-model.trim="formData.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="sortIndex">
          <el-input v-model.trim="formData.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="sortIndex">
          <el-input v-model.trim="formData.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="sortIndex">
          <el-input v-model.trim="formData.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="所在部门" prop="sortIndex">
          <department
            :data="treeData"
            :initDepartment="{id:'11',label:'润工作'}"
            @handleData="handleData"
          ></department>
        </el-form-item>
        <el-form-item label="账号状态" prop="sortIndex">
          <el-radio-group v-model="formData.radio">
            <el-radio :label="3">启用</el-radio>
            <el-radio :label="6">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sortIndex">
          <el-button @click="saveUser">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import department from '@/components/department';

export default {
  name: 'createOrEditUser',
  components: {
    department,
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      visible: false,
      formData: {
        departName: '',
        parentDepart: '',
        sortIndex: '',
        radio: 3,
      },
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    show() {
      this.visible = true;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeDialog', { refreshPage: status == 'refreshPage' });
    },
    handleData(date) {
      this.formData.parentDepart = date.id;
    },
    saveUser() {
      this.close('refreshPage');
    },
    cancel() {
      this.close();
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>