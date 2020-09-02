<template>
  <div>
    <el-drawer
      title="通知内容"
      :visible.sync="showDetail"
      :with-header="true"
      @close="closed"
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      class="tl-drawer"
    >
      <div>
        <div>{{data.userName}}</div>
        <div style="display:flex;justify-content: space-between;">
          <div>{{data.cultureName}}</div>
          <div>{{data.cultureName}}</div>
        </div>
      </div>
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
    },
  },
  watch: {},
};
</script>