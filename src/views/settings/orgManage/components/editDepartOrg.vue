<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form ref="form" :model="form" label-width="110px" class="tl-form">
      <el-form-item label="当前部门">
        <em>{{rowData.orgName}}</em>
      </el-form-item>
      <el-form-item label="选择成员" :inline="true" class="tl-label-self" v-if="cancelUser">
        <el-input v-model="rowData.userName" :disabled="cancelUser"></el-input>
        <el-button :disabled="!cancelUser" @click="cancelSet">取消设置</el-button>
      </el-form-item>
      <el-form-item label="选择成员" class="tl-label-self" v-if="!cancelUser">
        <tl-select-member @click.native.stop @getMember="selectMb"></tl-select-member>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" class="tl-btn amt-bg-slip">确定</el-button>
      <el-button plain @click="close" class="tl-btn amt-border-fadeout">取消</el-button>
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
    rowData: {
      type: Object,
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
      form: {
        region: [],
      },
      cancelUser: true,
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
    if (this.rowData.leader) {
      this.cancelUser = true;
    } else {
      this.cancelUser = false;
    }
  },
  methods: {
    init() {
      this.setOrgIdList(this.globalOrgId);
    },
    cancelSet() {
      const user = this.rowData;
      const option = 'removeDepartLeder';
      // const title = user.leader ? `是否取消部门负责人${user.userName}?` : `是否设置${user.userName}为部门负责人？`;
      this.server[option]({ userId: user.userId, orgId: user.leader ? user.leader : user.orgId, roleCode: 'ORG_ADMIN' }).then((res) => {
        if (res.code == 200) {
          this.cancelUser = false;
          this.$emit('searchList');
        }
      });
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
    },
    submit() {
      const user = this.rowData;
      const option = 'setDepartLeader';
      // const title = user.leader ? `是否取消部门负责人${user.userName}?` : `是否设置${user.userName}为部门负责人？`;
      this.server[option]({ userId: this.listUser[0].userId, orgId: user.orgId, roleCode: 'ORG_ADMIN' }).then((res) => {
        if (res.code == 200) {
          this.$emit('searchList');
        }
      });
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
      this.dialogVisible = false;
    },
  },
};
</script>