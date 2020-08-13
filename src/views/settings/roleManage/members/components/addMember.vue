<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 18:02:57
 * @Description: file content
-->
<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    center
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input
          style="width:320px"
          :value="decodeURI($route.query.name)"
          disabled
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择成员" class="addMember">
        <div class="roulemember">
          <tl-select-member @click.native.stop @getMember="selectMb"></tl-select-member>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import selectMember from './selectMember';
import Server from '../server';

const server = new Server();
export default {
  name: 'home',
  props: {
    title: {
      type: String,
      required: true,
    },
    rouleType: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      server,
      form: {
        region: [],
      },
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
    selectMb(data) {
      this.listUser = data;
    },
    submit() {
      this.server.addUserRole({
        listUser: this.listUser,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit('getTableList');
          this.closed();
        } else {
          this.$message.error(res.msg);
        }
      });
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
<style  scoped>
.addMember {
  position: relative;
}
.roulemember {
  width: 100%;
}
</style>
