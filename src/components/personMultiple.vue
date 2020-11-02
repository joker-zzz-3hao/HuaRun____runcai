<template>
  <el-popover
    placement="bottom"
    width="200"
    trigger="click"
    @show="show"
    @hide="hide"
    v-model="visible"
    popper-class="search-popover"
  >
    <el-input
      placeholder="搜索"
      v-model="keyword"
      class="tl-input"
      clearable
      maxlength="64"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-checkbox-group v-model="searchUser" @change="handleClick">
      <el-checkbox
        v-for="(item, index) in filterCreate"
        :label="item.userId"
        :key="item.userId + index"
        class="tl-checkbox"
      >
        <em>{{ item.userName }}</em>
        <em v-if="item.userAccount">{{ `(${item.userAccount})` }}</em>
      </el-checkbox>
    </el-checkbox-group>
    <div class="flex-end">
      <el-button @click="closepop" type="primary" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
    </div>
    <div slot="reference">
      <template v-if="showSelect">
        <div v-if="modelVal.length < 1">{{ this.title }}</div>
        <div v-for="p in cutPic" :key="p.userId" class="user-info">
          <img v-if="p.headUrl" :src="p.headUrl" alt="" />
          <div v-else class="user-name">
            <em>{{ p.userName.substring(p.userName.length - 2) }}</em>
          </div>
        </div>
        <div v-if="modelVal.length > 0">（{{ modelVal.length }}人）</div>
        <span v-if="modelVal.length > 0" @click="clear">
          <i class="el-icon-circle-close"></i
        ></span>
        <i :class="arrowClass"></i>
      </template>
      <template v-else><i class="el-icon-circle-plus-outline"></i></template>
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
      arrowClass: 'el-icon-caret-bottom',
      visible: false,
    };
  },

  model: {
    prop: 'modelVal', // 指向props的参数名
    event: 'change', // 事件名称
  },
  props: {
    modelVal: {
      type: Array,
      default() {
        return [];
      },
    },
    userList: {
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
    filterCreate() {
      return this.userList.filter(
        (data) => !this.keyword || data.userName.toLowerCase().includes(this.keyword.toLowerCase()),
      ) || [];
    },
    cutPic() {
      const list = [];
      this.modelVal.forEach((id, index) => {
        if (index < 4) {
          this.userList.forEach((uitem) => {
            if (uitem.userId == id) {
              list.push(uitem);
            }
          });
        }
      });
      return list;
    },
  },
  created() {
    this.searchUser = this.modelVal;
  },
  methods: {
    handleClick() {
      this.$emit('change', this.searchUser);
    },
    // 删除
    clear() {
      this.$emit('change', []);
      this.searchUser = [];
    },
    show() {
      this.arrowClass = 'el-icon-caret-top';
    },
    hide() {
      this.arrowClass = 'el-icon-caret-bottom';
    },
    closepop() {
      this.visible = false;
    },
  },
};
</script>