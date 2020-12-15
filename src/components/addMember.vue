<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="true"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :append-to-body="true"
    :title="title"
    :modal="true"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >

    <el-form ref="form" :model="form" label-width="80px" class="tl-form">
      <el-form-item label="选择成员" class="tl-label-self">
        <tl-select-member
          @click.native.stop
          @getMember="selectMb"
          :orgUserId="orgUserId"
          :rouleType="rouleType"
          :selectListed="selectListed"
          :disabledId="disabledId"
          @selectUserCheck="selectUserCheck"
          :objectType="objectType"
          :userType="userType"
          :DisuserId="DisuserId"
          @filterMembers="filterMembers"
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
      required: false,
      default: false,
    },
    selectListed: {
      type: Array,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    disabledId: {
      type: String,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: '',
    },
    userType: {
      type: Boolean,
      required: false,
      default: false,
    },
    orgUserId: {
      type: String,
      required: false,
    },
    projectManagerList: {
      type: Array,
      required: false,
    },
    DisuserId: {
      type: Object,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
    },
    model: {
      type: Boolean,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: false,
    },
  },

  data() {
    return {
      server,
      loading: false,
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
    filterMembers() {
      this.$emit('filterMembers');
    },
    selectUserCheck(id) {
      this.$emit('selectUserCheck', id);
    },
    selectMb(data) {
      this.listUser = data;
    },
    submit() {
      this.loading = true;
      this.$emit('submitFunctin', this.listUser);
      setTimeout(() => {
        this.loading = false;
      }, 800);
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