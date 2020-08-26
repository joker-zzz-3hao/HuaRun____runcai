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
    <el-form ref="form" :model="form" label-width="80px" class="tl-form">
      <el-form-item label="角色名称">
        <em>{{decodeURI($route.query.name)}}</em>
      </el-form-item>
      <el-form-item label="选择成员" class="tl-label-self">
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