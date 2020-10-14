<template>
  <div class="tl-custom-popover">
    <el-popover placement="bottom" width="200" trigger="click">
      <div>
        <el-input
          placeholder="搜索"
          v-model="keyword"
          class="tl-input"
          clearable
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-checkbox-group v-model="searchUser" @change="handleClick">
          <el-checkbox
            v-for="item in filterCreate"
            :label="item.userId"
            :key="item.userId"
          >
            <el-avatar :size="30" :src="item.headUrl">
              <div v-if="item.userName" class="user-name">
                <em>{{ item.userName.substring(item.userName.length - 2) }}</em>
              </div>
            </el-avatar>
            <span>{{ item.userName }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="reference">
        <div v-if="modelVal.length < 1">{{ this.title }}</div>
        <div v-for="p in modelVal" :key="p">
          <em> {{ userMap[p] }}</em>
        </div>
      </div>
    </el-popover>
  </div>
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
  },
  computed: {
    filterCreate() {
      return this.userList.filter(
        (data) => !this.keyword || data.userName.toLowerCase().includes(this.keyword.toLowerCase()),
      ) || [];
    },
  },
  created() {
  },
  methods: {
    handleClick() {
      console.log(this.searchUser);
      this.$emit('change', this.searchUser);
    },
    // 删除单个执行人
    clearPersonNode(pId) {
      const index = this.userList.indexOf(pId);
      if (index >= 0) {
        this.userList.splice(index, 1);
        this.handleClick();
      }
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>