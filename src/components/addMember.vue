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
import selectMember from './selectMemberList';
import Server from './server';

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
      this.$emit('submitFunctin', this.listUser);
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