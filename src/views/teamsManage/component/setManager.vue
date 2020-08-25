<template>
  <div>
    <el-drawer
      title="我是标题"
      :visible.sync="showSetManager"
      :with-header="false"
      @close="closed"
      :modal="false"
      :append-to-body="false"
    >
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'setManager',
  components: {},
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
      showSetManager: true,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show() {
      const self = this;
      self.showSetManager = true;
    },
    closed() {
      this.showSetManager = false;
      this.$emit('closed');
    },
  },
  watch: {},
};
</script>