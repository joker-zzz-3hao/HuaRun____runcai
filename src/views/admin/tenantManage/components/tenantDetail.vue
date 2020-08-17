<template>
  <el-drawer
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    title="详情"
    direction="rtl"
    size="35%"
    :visible.sync="dialogTableVisible"
    center
  >
    <div class="modelCreate">
      <el-form ref="form" label-width="110px">
        <el-form-item label="租户名称" prop="tenantName">
          <span>{{form.tenantName}}</span>
        </el-form-item>
        <el-form-item label="企业ID" prop="tenantID">
          <span>{{form.tenantID}}</span>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <span>{{form.applyUser}}</span>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobilePhone">
          <span>{{form.mobilePhone}}</span>
        </el-form-item>
        <el-form-item label="开放菜单功能">
          <el-tree
            disabled
            @check-change="handleCheckChange"
            ref="treeMenu"
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
          ></el-tree>
        </el-form-item>
        <!-- <el-form-item label="使用时间" prop="date">
          <el-date-picker
            v-model="form.date"
            @change="changDate"
            :disabled="infoBool"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="租户状态">
          <span>{{CONST.STATUS[form.status]}}</span>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>
<script>
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'tenantDetail',
  props: {
    title: {
      type: String,
      required: true,
    },
    tenantId: {
      type: [String, Number],
      required: false,
    },
    infoBool: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      CONST,
      server,
      form: {
        tenantName: '',
        applyUser: '',
        mobilePhone: '',
        tenantID: '',
        date: '',
        status: 'O',
        startTime: '',
        endTime: '',
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    // 判断租户ID存在请求租户详情接口
    if (this.tenantId) {
      this.getTenant();
      this.$nextTick(() => {
        this.handleCheckChange();
      });
    }
    this.getqueryMenu();
  },
  methods: {
    // 获取选中tree key值 展示选中
    handleCheckChange() {
      const keys = this.$refs.treeMenu.getCheckedKeys();
      this.form.menuTree = keys.map((item) => ({ functionId: item }));
    },
    changDate(date) {
      // eslint-disable-next-line prefer-destructuring
      this.form.startTime = date[0];
      // eslint-disable-next-line prefer-destructuring
      this.form.endTime = date[1];
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = this.getTreeList(res.data, true);
        });
    },
    // 递归修改符合element tree结构数据
    getTreeList(data, disabled) {
      if (data) {
        return data.map((item) => ({
          id: item.functionId,
          label: item.functionName,
          disabled: this.infoBool,
          children: this.getTreeList(item.children, disabled),
        }));
      }
    },
    // 获取租户详情
    getTenant() {
      this.server.getTenant({ tenantId: this.tenantId })
        .then((res) => {
          console.log(res);
          this.form.tenantName = res.data.tenantName;
          this.form.applyUser = res.data.applyUser;
          this.form.mobilePhone = res.data.mobilePhone;
          this.form.tenantID = res.data.tenantID;
          this.form.status = res.data.status;
          // this.form.date = [new Date(res.data.startTime), new Date(res.data.endTime)];
          // this.form.startTime = res.data.startTime;
          // this.form.endTime = res.data.endTime;
          const keys = res.data.menuTree.map((item) => item.functionId);
          this.$nextTick(() => {
            this.$refs.treeMenu.setCheckedKeys(keys);
          });
        });
    },
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogTableVisible = !this.dialogTableVisible;
    },
  },
};
</script>
<style  scoped>
.modelCreate {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 620px;
}
</style>
