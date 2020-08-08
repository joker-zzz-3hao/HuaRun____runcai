<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      append-to-body="true"
      :visible="visible"
      @close="close"
      title="设置负责人"
      :close-on-click-modal="false"
    >
      <el-form ref="leaderForm" :model="formData">
        <el-form-item label="部门名称" prop="departName">
          <el-input v-model.trim="formData.departName"></el-input>
        </el-form-item>
        <el-form-item label="指定部门负责人" prop="parentDepart">
          <el-select
            v-model="formData.departName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名称/LDAP账号"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in employeeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="sortIndex">
          <el-button @click="saveLeader">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import validateMixin from '../validateMixin';

export default {
  name: 'setLeader',
  mixins: [validateMixin],
  components: {
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    server: {
      type: Object,
      default() {
        return {};
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
      employeeList: [],
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
    saveLeader() {
      this.close('refreshPage');
    },
    cancel() {
      this.close();
    },
    remoteMethod() {
      this.employeeList = [];
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>