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
      <el-form ref="form" :model="form" label-width="110px">
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
        <el-form-item label="使用时间" prop="date">
          <el-date-picker
            v-model="form.date"
            @change="changDate"
            :disabled="infoBool"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="租户状态">
          <el-radio-group v-model="form.status" :disabled="infoBool">
            <el-radio label="O">启用</el-radio>
            <el-radio label="S">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="validateForm('form')">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'createTenant',
  props: {
    title: {
      type: String,
      required: true,
    },
    tenantId: {
      type: String,
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
    if (this.tenantId) {
      this.getTenant();
      this.$nextTick(() => {
        this.handleCheckChange();
      });
    }
    this.getqueryMenu();
  },
  methods: {
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

    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
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
