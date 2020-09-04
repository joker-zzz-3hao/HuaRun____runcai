<template>
  <div class="role-type">
    <div class="operating-area">
      <div class="page-title">价值观分布数据</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item label="组织">
            <div @click="showCascader=!showCascader">
              <el-input v-model="formData.orgName" style="width: 200px;"></el-input>
            </div>
            <el-cascader-panel
              v-model="formData.orgFullId"
              :style="{display: showCascader ? '' : 'none'}"
              :options="departmentData"
              :show-all-levels="false"
              @change="selectIdChange"
              :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgFullId',label:'orgName',children:'children' }"
            ></el-cascader-panel>
          </el-form-item>
          <el-form-item label="周期">
            <div style="margin-left:20px;" v-if="cycleData.length>0 && showDepartmentSelect">
              <department
                :data="cycleData"
                type="cycleListSelect"
                @handleData="handleCycleData"
                :defaultProps="cycleDefaultProps"
              ></department>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import department from '@/components/department';
import Server from '../server';

const server = new Server();
export default {
  name: 'worthStatistics',
  data() {
    return {
      server,
      showCascader: false,
      formData: {
        orgName: '',
        orgFullId: '',
      },
      departmentData: [],
      orgFullIdList: [],
      orgFullId: '',
    };
  },
  components: {
    department,
  },
  mounted() {
    this.getOrgTable();
  },
  methods: {
    selectIdChange(data) {
      this.showCascader = false;
      this.orgFullId = data[data.length - 1];
      this.orgFullIdList = this.orgFullId.split(':');
      this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.getOrgName(this.departmentData, 0);
    },
    getOrgTable() {
      // 查询组织树
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData.push(res.data);
            this.formData.orgFullId = this.departmentData[0].orgFullId;
            this.orgFullIdList = this.formData.orgFullId.split(':');
            this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.getOrgName(this.departmentData, 0);
          }
        }
      });
    },
    getOrgName(data, index) {
      data.forEach((item) => {
        if (this.orgFullIdList[index] == item.orgId) {
          if (item.children && item.children.length > 0 && this.orgFullIdList[index + 1]) {
            this.getOrgName(item.children, index + 1);
          } else if ((index + 1) == this.orgFullIdList.length) {
            this.formData.orgName = item.orgName;
          }
        }
      });
    },
  },
};
</script>