<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog :visible="visible" @close="close" title="角色设置" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="formData">
        <el-form-item label="用户姓名" prop="departName">
          <el-input v-model.trim="formData.departName"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="departName">
          <el-select v-model="value1" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在部门" prop="parentDepart">
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
          <el-button @click="saveRole">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import department from '@/components/department';

export default {
  name: 'setRole',
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
      roleList: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }],
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
    saveRole() {
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