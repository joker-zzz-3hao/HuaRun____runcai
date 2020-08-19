<template>
  <el-drawer
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    title="详情"
    direction="rtl"
    size="35%"
    :modal="false"
    :visible.sync="dialogTableVisible"
    center
  >
    <div class="modelCreate">
      <el-form ref="form" label-width="110px">
        <el-form-item label="租户名称" prop="tenantName">
          <span>{{form.tenantName}}</span>
        </el-form-item>
        <el-form-item label="企业ID" prop="tenantId">
          <span>{{form.tenantId}}</span>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <span>{{form.applyUser}}</span>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobilePhone">
          <span>{{form.mobilePhone}}</span>
        </el-form-item>
        <el-form-item label="开放菜单功能">
          <div class="menuTreeList">
            <div class="list" v-for="(item,index) in menuTreeList" :key="index">{{item}}</div>
          </div>
        </el-form-item>
        <div class="postMenu" v-show="false">
          <el-cascader-panel
            @change="handleCheckChange"
            ref="treeMenu"
            v-model="selectArr"
            :options="data"
            :props="{ multiple: true }"
            node-key="id"
          ></el-cascader-panel>
        </div>
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
      menuTreeList: [],
      selectArr: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    // 判断租户ID存在请求租户详情接口

    this.getqueryMenu();
  },
  methods: {
    // 获取选中tree key值 展示选中
    handleCheckChange() {
      const keys = this.$refs.treeMenu.getCheckedNodes();
      // eslint-disable-next-line array-callback-return
      const keyCheck = keys.map((item) => {
        if (item.children.length == 0) {
          return item.data.label;
        }
      });
      // eslint-disable-next-line array-callback-return
      this.menuTreeList = keyCheck.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.form.menuTree = keys.map((item) => ({ functionId: item }));
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = this.getTreeList(res.data, true);
          this.getTenant();
        });
    },
    // 递归修改符合element tree结构数据
    getTreeList(data, disabled) {
      if (data) {
        return data.map((item) => ({
          id: item.functionId,
          label: item.functionName,
          value: item.functionCode,
          checkStrictly: true,
          disabled: this.infoBool,
          emitPath: false,
          children: this.getTreeList(item.children, disabled),
        }));
      }
    },
    // 获取租户详情
    getTenant() {
      this.server.getTenant({ tenantId: this.tenantId })
        .then((res) => {
          this.form.tenantName = res.data.tenantName;
          this.form.applyUser = res.data.applyUser;
          this.form.mobilePhone = res.data.mobilePhone;
          this.form.tenantID = res.data.tenantId;
          this.form.status = res.data.status;
          // eslint-disable-next-line array-callback-return
          const keys = res.data.menuItems.map((item) => {
            if (item) {
              return item.split(':');
            }
          });
          // eslint-disable-next-line array-callback-return
          this.selectArr = keys.filter((item) => {
            if (item) {
              return item;
            }
          });
          this.$nextTick(() => {
            this.handleCheckChange();
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
.menuTreeList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.menuTreeList .list {
  background: #f4f6f8;
  border-radius: 14px;
  padding: 1px 10px;
}
</style>
