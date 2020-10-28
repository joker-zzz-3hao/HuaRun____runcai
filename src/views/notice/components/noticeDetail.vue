<template>
  <div>
    <el-drawer
      :visible.sync="showDetail"
      :with-header="true"
      @close="closed"
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      custom-class="custom-drawer"
      class="tl-drawer"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">通知内容</div>
      </div>
      <el-scrollbar>
        <div class="cont-box">
          <div>{{ data.msgContent }}</div>
          <div style="display: flex; justify-content: space-between">
            <div>
              <span>通知人：</span>
              <span>{{ data.sendUserName }}</span>
            </div>
            <div>
              <span>通知时间：</span>
              <span>{{ data.createDate }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'editTeam',
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      data: {},
      showDetail: false,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show(data) {
      this.data = data;
      this.showDetail = true;
    },
    closed() {
      this.showDetail = false;
      this.$emit('close');
    },
  },
  watch: {},
};
</script>