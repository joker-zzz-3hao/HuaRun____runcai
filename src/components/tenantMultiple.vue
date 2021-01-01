<template>
  <el-popover
    placement="bottom"
    width="200"
    trigger="click"
    @show="show"
    v-model="visible"
    popper-class="search-popover"
    class="multi-tenant"
  >
    <el-scrollbar>
      <el-checkbox-group v-model="searchUser" @change="handleClick">
        <el-checkbox
          v-for="(item, index) in tenantList"
          :label="item.tenantId"
          :key="item.tenantId + index"
          class="tl-checkbox"
        >
          <em>{{ item.tenantName }}</em>
          <em v-if="item.tenantId">{{ `(${item.tenantId})` }}</em>
        </el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>
    <div class="flex-end">
      <el-button @click="closepop" type="primary" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
    </div>
    <div slot="reference">
      <div class="btn-display" style="display: flex">
        <i class="el-icon-circle-plus-outline"></i>添加租户
      </div>
    </div>
  </el-popover>
</template>

<script>

import CONST from './const';

export default {
  name: 'personMultiple',
  components: {
  },
  data() {
    return {
      CONST,
      isShow: false,
      keyword: '',
      searchUser: [],
      visible: false,
    };
  },

  model: {
    event: 'change', // 事件名称
  },
  props: {

    tenantList: {
      type: Array,
      default() {
        return [];
      },
    },
    userMap: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default: '请选择',
    },
    showSelect: {
      type: Boolean,
      default: true,
    },
  },
  computed: {

  },
  created() {
  },
  methods: {
    // 删除
    clear() {
      this.$emit('change', []);
      this.searchUser = [];
    },

    closepop() {
      this.$emit('change', this.searchUser);
      this.searchUser = [];
      this.visible = false;
    },
  },
};
</script>
<style lang="css">
.multi-tenant .btn-display {
}
</style>