<template>
  <div>
    <el-form class="tl-form" :label-position="'left'">
      <el-form-item label="选择部门">
        <el-cascader-panel
          ref="treeMenu"
          v-model="orgId"
          @change="getOrgListName"
          :options="options"
          :collapse-tags="false"
          :props="{
            multiple: true,
            checkStrictly: false,
            id: 'orgFullId',
            label: 'orgName',
            value: 'orgFullId',
            children: 'sonTree',
            emitPath: false,
            orgParentId: 'orgParentId',
          }"
          node-key="orgFullId"
        ></el-cascader-panel>
      </el-form-item>
      <el-form-item label="发送类型">
        <el-radio-group
          v-model="selectType"
          class="tl-radio-group"
          @change="typeAction"
        >
          <el-radio label="1" class="tl-radio">负责人</el-radio>
          <el-radio label="2" class="tl-radio">成员</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  props: ['selectlist'],
  data() {
    return {
      title: '添加部门',
      dialogTableVisible: false,
      num: 0,
      server,
      options: [],
      orgId: '',
      selectType: '1',
      btnLoad: false,
      orgData: {},
      orgParentId: '',
    };
  },
  mounted() {
    this.queryMenu();
  },
  methods: {
    close() {
      this.dialogTableVisible = false;
    },
    queryMenu() {
      this.server.getOrg().then((res) => {
        // this.options = res.data;
        this.options = res.data;
      });
    },

    getOrgListName(data) {
      this.orgData = data;
      this.$emit('getOrgData', this.orgData, this.selectType);
    },
    typeAction() {
      this.$emit('getOrgData', this.orgData, this.selectType);
    },
    submitForm() {

    },
  },
};
</script>
<style  scoped>
</style>