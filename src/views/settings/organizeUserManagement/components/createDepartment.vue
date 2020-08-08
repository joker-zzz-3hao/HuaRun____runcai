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
      title="创建部门"
      :close-on-click-modal="false"
    >
      <el-form ref="departForm" :model="formData">
        <el-form-item
          label="部门名称"
          prop="orgName"
          :rules="[{required:true,message:'请填写部门名称',trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.orgName"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="orgParentId">
          <tl-department
            :data="treeData"
            :initDepartment="initDepartment"
            :defaultProps="{ children: 'sonTree', label: 'orgName'}"
            v-model="formData.orgParentId"
            :type="'department'"
            @handleData="handleData"
          ></tl-department>
        </el-form-item>
        <el-form-item label="序号" prop="orgSort">
          <el-input-number
            v-model.trim="formData.orgSort"
            controls-position="right"
            :min="1"
            :max="1000"
          ></el-input-number>（用于部门显示顺序）
        </el-form-item>
        <el-form-item prop="orgSort">
          <el-button :loading="loading" @click="saveDepart">确定</el-button>
          <el-button :disabled="loading" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import department from '@/components/department';
import validateMixin from '../validateMixin';

export default {
  name: 'createDepartment',
  mixins: [validateMixin],
  components: {
    'tl-department': department,
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
    initDepartment: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      formData: {
        orgName: '',
        orgParentId: this.initDepartment.orgId ? this.initDepartment.orgId : this.treeData[0].orgId, // 用户所在部门ID
        orgSort: '',
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
      this.$emit('closeOrgDialog', { refreshPage: status == 'refreshPage' });
    },
    handleData(date) {
      this.formData.orgParentId = date.orgId;
    },
    saveDepart() {
      this.$refs.departForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.createOrg(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('部门创建成功');
              this.close('refreshPage');
            }
            this.loading = false;
          });
        }
      });
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