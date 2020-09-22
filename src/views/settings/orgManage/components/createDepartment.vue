<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="departOptionType=='create'?'创建部门':'编辑部门'"
      :close-on-click-modal="false"
    >
      <el-form ref="departForm" :model="formData" label-width="80px">
        <el-form-item
          label="部门名称"
          prop="orgName"
          :rules="[{required:true,message:'请填写部门名称',trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.orgName" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="上级部门"
          prop="orgParentId"
          :rules="[{required:true,message:'请选择上级部门',trigger:'blur'}]"
        >
          <el-cascader
            v-model="formData.orgParentId"
            ref="departCascader"
            :options="treeData"
            :show-all-levels="false"
            node-key="orgId"
            :props="{ checkStrictly: true, value:'orgId',label:'orgName',children:'sonTree',emitPath:false  }"
            @change="selectIdChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="序号"
          prop="orgSort"
          :rules="[{required:true,message:'请填写序号',trigger:'blur'}]"
        >
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
import validateMixin from '../validateMixin';

export default {
  name: 'createDepartment',
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
    initDepartment: {
      type: Object,
      default() {
        return {};
      },
    },
    departOptionType: {
      type: String,
      default() {
        return 'create';
      },
    },
  },
  data() {
    return {
      visible: false,
      cheOrgId: '',
      loading: false,
      formData: {
        orgName: '',
        orgParentId: this.initDepartment.orgId ? this.initDepartment.orgId : this.treeData[0].orgId, // 用户所在部门ID
        orgSort: '',
        orgFullId: this.initDepartment.orgId ? this.initDepartment.orgId : this.treeData[0].orgFullId,
        orgIdList: [],
        orgId: '',
      },
    };
  },
  created() {
    console.log(this.treeData);
    // this.setOrgIdList(this.initDepartment.orgId);
  },
  mounted() {
  },
  computed: {},
  methods: {
    show(depart) {
      if (depart) {
        if (this.departOptionType == 'edit') {
          this.formData.orgName = depart.orgName;
          this.formData.orgSort = depart.orgSort;
          this.formData.orgParentId = depart.orgParentId;

          const orgFull = depart.orgFullId.split(':');
          const index = orgFull.findIndex(((item) => item == depart.orgId));
          orgFull.splice(index, 1);
          this.formData.orgFullId = orgFull.join(':');
          this.formData.orgId = depart.orgId;
          this.cheOrgId = depart.orgId;
        } else if (this.departOptionType == 'create') {
          this.formData.orgFullId = depart.orgFullId;
          this.formData.orgId = depart.orgId;
        }
      } else {
        this.formData.orgFullId = this.treeData[0].orgFullId;
      }
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    close(status) {
      this.visible = false;
      this.$emit('closeOrgDialog', { refreshPage: status == 'refreshPage' });
    },
    handleData(date) {
      this.formData.orgParentId = date.orgId;
    },
    saveDepart() {
      const params = {
        // orgFullId: this.formData.orgIdList.join(':'),
        // orgParentId: this.formData.orgIdList[this.formData.orgIdList.length - 1],
        // orgName: this.formData.orgName,
        // orgSort: this.formData.orgSort,
      };

      if (this.departOptionType == 'edit') {
        params.orgId = this.formData.orgId;
        params.orgFullId = this.formData.orgFullId;
        params.orgParentId = this.formData.orgParentId;
        params.orgName = this.formData.orgName;
        params.orgSort = this.formData.orgSort;
      } else {
        params.orgFullId = this.formData.orgFullId;
        params.orgParentId = this.formData.orgParentId;
        // eslint-disable-next-line no-unused-expressions
        params.orgName = this.formData.orgName;
        params.orgSort = this.formData.orgSort;
      }
      this.$refs.departForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let urlApi;
          // eslint-disable-next-line no-unused-expressions
          this.departOptionType == 'create' ? urlApi = 'createOrg' : urlApi = 'updateOrg';
          this.server[urlApi](params).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
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
    selectIdChange(data) {
      const node = this.$refs.departCascader.getCheckedNodes();
      if (this.departOptionType == 'edit') {
        if (data == this.cheOrgId) {
          this.formData.orgParentId = '';
          this.$message.error('不能选择自己部门');
          return false;
        }
        this.formData.orgFullId = node[0].data.orgFullId;
        this.formData.orgParentId = node[0].data.orgId;
      } else {
        this.formData.orgFullId = node[0].data.orgFullId;
      }

      // this.formData.orgParentId = node[0].data.orgParentId;
      this.$refs.departCascader.dropDownVisible = false;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>