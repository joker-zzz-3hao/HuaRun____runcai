<template>
  <el-dialog
    :append-to-body="true"
    :before-close="close"
    @closed="close"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
    :title="title"
  >
    <el-form class="tl-form" :label-position="'left'">
      <el-form-item label="选择部门：">
        <el-cascader
          ref="treeMenu"
          v-model="orgId"
          @change="getOrgListName"
          :options="options"
          :props="{
            checkStrictly: true,
            id: 'orgId',
            label: 'orgName',
            value: 'orgId',
            children: 'sonTree',
            emitPath: false,
          }"
          node-key="orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="发送类型：">
        <el-radio-group v-model="selectType" class="tl-radio-group">
          <el-radio :label="1" class="tl-radio">负责人</el-radio>
          <el-radio :label="0" class="tl-radio">成员</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submitForm"
        class="tl-btn amt-bg-slip"
        :loading="btnLoad"
        >确定</el-button
      >
      <el-button plain @click="close" class="tl-btn amt-border-fadeout"
        >取 消</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  data() {
    return {
      title: '添加部门',
      dialogTableVisible: false,
      num: 20,
      server,
      options: '',
      orgId: '',
      selectType: '',
      btnLoad: false,
      orgData: {},
    };
  },
  mounted() {
    this.queryMenu();
  },
  methods: {
    show() {
      this.dialogTableVisible = true;
    },
    close() {
      this.dialogTableVisible = false;
    },
    queryMenu() {
      this.server.getOrg().then((res) => {
        this.options = res.data;
      });
    },
    getOrgListName() {
      const orgName = this.$refs.treeMenu.getCheckedNodes(true)[0].label;
      this.orgData = {
        orgName,
        orgId: this.orgId,
      };
    },
    submitForm() {
      this.$emit('getOrgData', { orgData: this.orgData, selectType: this.selectType });
      this.close();
    },
  },
};
</script>
<style  scoped>
</style>