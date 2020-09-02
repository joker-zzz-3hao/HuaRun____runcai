<template>
  <div class="home">
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">点我打开</el-button>
    <el-drawer
      title="我是外面的 Drawer"
      :visible.sync="drawer"
      size="50%"
      class="tl-drawer"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <div>
        <el-button @click="innerDrawer = true">打开里面的!</el-button>
        <el-drawer
          title="我是里面的"
          :append-to-body="true"
          :before-close="handleClose"
          :visible.sync="innerDrawer"
          class="tl-drawer"
        >
          <p>_(:зゝ∠)_</p>
        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'concernedOkr',
  components: {
  },
  data() {
    return {
      drawer: false,
      innerDrawer: false,
    };
  },
};
</script>