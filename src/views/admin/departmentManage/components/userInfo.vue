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
      title="详情"
      :close-on-click-modal="false"
    >
      <el-form ref="roleForm" :model="formData">
        <el-form-item label="用户账号" prop="departName">
          <span>{{userInfo.userAccount}}</span>
        </el-form-item>
        <el-form-item label="用户姓名" prop="departName">
          <span>{{userInfo.userName}}</span>
        </el-form-item>
        <el-form-item label="手机号码" prop="departName">
          <span>{{userInfo.userMobile}}</span>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="departName">
          <span>{{userInfo.userMail}}</span>
        </el-form-item>
        <el-form-item label="所属租户" prop="departName">
          <span>{{userInfo.tenantName}}</span>
        </el-form-item>
        <el-form-item label="所在部门" prop="departName">
          <span>{{combinedOrgName}}</span>
        </el-form-item>
        <el-form-item label="用户状态" prop="departName">
          <span>{{CONST.USER_STATUS_MAP[userInfo.userStatus]}}</span>
        </el-form-item>
        <el-form-item prop="departName">
          <el-button @click="cancel">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import validateMixin from '../validateMixin';

export default {
  name: 'setRole',
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
    userAccount: {
      type: String,
      default() {
        return '';
      },
    },
    CONST: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      userInfo: {},
      nameList: [],
      combinedOrgName: '',
      formData: {
        departName: '',
        parentDepart: '',
        sortIndex: '',
        radio: 3,
      },
    };
  },
  created() {
    this.server.getUserInfo({ userAccount: this.userAccount }).then((res) => {
      if (res.code == 200) {
        this.userInfo = res.data;
        this.getCombinedOrgName(res.data.orgId);
        // this.setInitDepartment(res.data.orgId);
      }
    });
  },
  mounted() {},
  computed: {},
  methods: {
    show() {
      this.visible = true;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeUserDialog', { refreshPage: status == 'refreshPage' });
    },
    cancel() {
      this.close();
    },
    getCombinedOrgName(orgId) {
      // ************************************************
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
      this.getNameStr(result, orgId);
      this.nameList.reverse();
      this.combinedOrgName = this.nameList.join('-') || '--';
      // *******************************************************
    },
    getNameStr(resultList, orgId) {
      const result = [...resultList];
      let orgParentId = '';
      for (const org of result) {
        if (org.orgId == orgId) {
          orgParentId = org.orgParentId;
          this.nameList.push(org.orgName);
          this.getNameStr(result, orgParentId);
        }
      }
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>