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
            id: 'orgFullId',
            label: 'orgName',
            value: 'orgFullId',
            children: 'sonTree',
            emitPath: false,
            disabled: 'disabled',
          }"
          node-key="orgFullId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="发送类型：">
        <el-radio-group v-model="selectType" class="tl-radio-group">
          <el-radio label="1" class="tl-radio">负责人</el-radio>
          <el-radio label="2" class="tl-radio">成员</el-radio>
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
  props: ['selectlist'],
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

  },
  methods: {
    show() {
      this.orgId = '';
      this.selectType = '';
      this.dialogTableVisible = true;
      this.queryMenu();
    },
    close() {
      this.dialogTableVisible = false;
    },
    queryMenu() {
      this.server.getOrg().then((res) => {
        // this.options = res.data;
        // this.options = res.data;
      //  console.log(this.options);
        this.options = this.changeData(res.data);
      });
    },
    disabledFun(fullId) {
      const funBool = this.selectlist.some((item) => fullId == item.orgData.orgId);
      return funBool;
    },
    changeData(data) {
      let list = [];
      if (data) {
        list = data.map((item) => ({
          orgName: item.orgName,
          orgFullId: item.orgFullId,
          sonTree: this.changeData(item.sonTree).length == 0 ? '' : this.changeData(item.sonTree),
          disabled: this.disabledFun(item.orgFullId),
        }));
      }
      return list;
    },
    getOrgListName() {
      const orgName = this.$refs.treeMenu.getCheckedNodes(true)[0].label;
      this.orgData = {
        orgName,
        orgId: this.orgId,
      };
    },
    submitForm() {
      this.$emit('getOrgData', { orgData: this.orgData, remindType: this.selectType });
      this.close();
    },
  },
};
</script>
<style  scoped>
</style>