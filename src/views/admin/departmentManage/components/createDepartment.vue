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
      title="创建部门"
      :close-on-click-modal="false"
    >
      <el-form ref="departForm" :model="formData">
        <el-form-item
          label="部门名称"
          prop="orgName"
          :rules="[{required:true,message:'请填写部门名称',trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.orgName" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="上级部门"
          prop="orgIdList"
          :rules="[{required:true,message:'请选择上级部门',trigger:'blur'}]"
        >
          <el-cascader
            v-model="formData.orgIdList"
            :options="treeData"
            :show-all-levels="false"
            :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgId',label:'orgName',children:'sonTree' }"
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
      loading: false,
      formData: {
        orgName: '',
        orgParentId: this.initDepartment.orgId ? this.initDepartment.orgId : this.treeData[0].orgId, // 用户所在部门ID
        orgSort: '',
        orgFullId: '',
        orgIdList: [],
      },
    };
  },
  created() {
    this.setOrgIdList(this.initDepartment.orgId);
  },
  mounted() {},
  computed: {},
  methods: {
    setOrgIdList(orgId) {
      // 遍历嵌套数组，转换为一维数组
      const queue = [...this.treeData];
      const result = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        result.push({
          orgId: next.orgId,
          orgName: next.orgName,
          orgParentId: next.orgParentId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      this.getOrgIdList(result, orgId);
      this.formData.orgIdList.reverse();
    },
    getOrgIdList(result, orgId) {
      let orgParentId = '';
      for (const org of result) {
        if (org.orgId == orgId) {
          orgParentId = org.orgParentId;
          this.formData.orgIdList.push(org.orgId);
          this.getOrgIdList(result, orgParentId);
        }
      }
    },
    show(depart) {
      if (depart) {
        this.formData.orgName = depart.orgName;
        this.formData.orgSort = depart.orgSort;
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
        orgFullId: this.formData.orgIdList.join(':'),
        orgParentId: this.formData.orgIdList[this.formData.orgIdList.length - 1],
        orgName: this.formData.orgName,
        orgSort: this.formData.orgSort,
      };
      if (this.departOptionType == 'edit') {
        params.orgId = this.initDepartment.orgId;
      }
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
    selectIdChange(data) {
      this.formData.orgIdList = data;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>