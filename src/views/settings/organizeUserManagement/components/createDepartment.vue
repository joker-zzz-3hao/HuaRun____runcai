<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog :visible="visible" @close="close" title="创建部门" :close-on-click-modal="false">
      <el-form ref="departForm" :model="formData">
        <el-form-item label="部门名称" prop="departName">
          <el-input v-model.trim="formData.departName"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentDepart">
          <!-- <el-input v-model.trim="formData.parentDepart"></el-input> -->
          <department
            :data="treeData"
            :initDepartment="{id:'11',label:'润工作'}"
            @handleData="handleData"
          ></department>
        </el-form-item>
        <el-form-item label="序号" prop="sortIndex">
          <el-input v-model.trim="formData.sortIndex"></el-input>（用于部门显示顺序）
        </el-form-item>
        <el-form-item prop="sortIndex">
          <el-button @click="saveDepart">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import department from '@/components/department';

export default {
  name: 'createDepartment',
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
      },
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    show(depart) {
      console.log(depart);
      this.visible = true;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeDialog', { refreshPage: status == 'refreshPage' });
    },
    handleData(date) {
      this.formData.parentDepart = date.id;
    },
    saveDepart() {
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