<template>
  <div>
    <el-drawer
      title="更多团队成员"
      :visible.sync="showMoreMembers"
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
        <div
          v-for="item in totalMemberList"
          :key="item.userId"
          style="width: 100%;justify-content: space-between;"
          class="display-flex"
        >
          <div class="display-flex">
            <div>
              <el-avatar :src="item.headerUrl"></el-avatar>
            </div>
            <div>
              <div>{{item.userName}}</div>
              <div>{{item.userAccount}}</div>
            </div>
          </div>
          <div>
            <el-button @click="setDepart(item)">设置虚线汇报部门</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    totalMemberList: {
      type: Array,
      default() {
        return [];
      },
    },
    setFictitious: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    return {
      showMoreMembers: false,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show() {
      this.showMoreMembers = true;
    },
    closed() {
      this.showMoreMembers = false;
    },
    setDepart(data) {
      this.setFictitious(data);
    },
  },
  watch: {},
};
</script>
<style scoped>
.display-flex {
  display: flex;
}
</style>