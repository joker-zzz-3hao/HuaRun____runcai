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
      <el-form-item
        :label="upDateType == 'update' ? 'OKR更新次数小于：' : 'OKR进度小于：'"
        prop="name"
      >
        <el-input-number v-model="num" :min="1"></el-input-number>
        <span v-if="upDateType == 'update'"> %</span>
      </el-form-item>
      <em v-for="(item, index) in selectlist" :key="index"
        >{{ item.orgData.orgName }}({{
          item.selectType == 0 ? "负责人" : "成员"
        }}) <i class="el-icon-error" @click="deleteList(index)"></i
      ></em>
      <el-form-item label="提醒范围：">
        <el-button type="text" @click="selectOrgShow">
          + 选择组织范围</el-button
        >
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
    <tl-selectOrg ref="selectOrg" @getOrgData="getOrgData"></tl-selectOrg>
  </el-dialog>
</template>
<script>
import Server from '../server';
import selectOrg from './selectOrg';

const server = new Server();
export default {
  data() {
    return {
      title: 'OKR进度更新提醒',
      dialogTableVisible: false,
      num: 20,
      server,
      options: '',
      orgList: '',
      selectType: '',
      btnLoad: false,
      selectlist: [],
    };
  },
  props: ['upDateType'],
  mounted() {
    this.queryMenu();
  },
  components: {
    'tl-selectOrg': selectOrg,
  },
  methods: {
    show() {
      this.dialogTableVisible = true;
    },
    getOrgData(data) {
      this.selectlist.push(data);
    },
    deleteList(index) {
      this.selectlist.splice(index, 1);
    },
    selectOrgShow() {
      this.$refs.selectOrg.show();
    },
    close() {
      this.dialogTableVisible = false;
    },
    queryMenu() {
      this.server.getOrg().then((res) => {
        this.options = res.data;
      });
    },
    submitForm() {},
  },
};
</script>
<style  scoped>
</style>