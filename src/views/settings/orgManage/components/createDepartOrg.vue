<template>
  <el-dialog
    :append-to-body="true"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form ref="form" :model="form" label-width="110px" class="tl-form">
      <el-form-item
        label="当前部门"
        prop="orgIdList"
        :rules="[
          { required: true, message: '请选择上级部门', trigger: 'blur' },
        ]"
      >
        <el-cascader
          v-model="form.orgIdList"
          :options="treeData"
          :show-all-levels="false"
          :props="{
            checkStrictly: true,
            value: 'orgId',
            label: 'orgName',
            children: 'sonTree',
          }"
          @change="selectIdChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="选择成员" class="tl-label-self">
        <el-input
          maxlength="50"
          v-model="listUserName"
          :clearable="false"
          @focus.stop="selectUserName"
          @clear.stop="clearUser"
        ></el-input>
        <span @click.stop="closeshowMember">关闭</span>
        <tl-select-member
          @click.native.stop
          @getMember="selectMb"
          v-show="showSelect"
        ></tl-select-member>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="submit"
        class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button
        :disabled="loading"
        plain
        @click="close"
        class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import selectMember from './selectMember';
import Server from '../server';

const server = new Server();
export default {
  name: 'addMember',
  props: {
    title: {
      type: String,
      required: true,
    },
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      server,
      loading: false,
      form: {
        region: [],
      },
      showSelect: false,
      listUserName: '',
      listUser: [],
      dialogTableVisible: false,
      dialogVisible: false,
    };
  },
  components: {
    'tl-select-member': selectMember,
  },
  mounted() {
    this.dialogTableVisible = true;
  },
  methods: {
    init() {
      this.setOrgIdList(this.globalOrgId);
    },
    selectUserName() {
      this.showSelect = true;
    },
    clearUser() {
      this.showSelect = false;
    },
    setOrgIdList(orgId) {
      if (!orgId) { // 无orgId默认使用顶级租户的orgId
        orgId = this.treeData[0].orgId;
      }
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
      this.formData.orgIdList = [];
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
    selectIdChange(data) {
      this.form.orgIdList = data;
    },
    selectMb(data) {
      this.listUser = data;
      console.log(data);
      if (data.length > 0) {
        this.listUserName = data[0].userName;
      } else {
        this.listUserName = '';
      }
    },
    submit() {
      console.log(this.form.orgIdList);
      this.$emit('createLeader', { orgId: this.form.orgIdList.pop(), userId: this.listUser[0].userId });
      this.close();
    },
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
    },
    closeshowMember() {
      this.showSelect = false;
    },
  },
};
</script>