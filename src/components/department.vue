<template>
  <div>
    <div>
      <div @click="showDepartment">
        <span>{{department.label}}</span>
        <i :class="arrowClass"></i>
      </div>
    </div>
    <div v-show="arrowClass == 'el-icon-caret-bottom'">
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
  </div>
</template>
<script>
import Server from './server';

const server = new Server();

export default {
  name: 'department',
  data() {
    return {
      server,
      arrowClass: 'el-icon-caret-top',
      department: {},
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id',
      },
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    initDepartment: {
      type: Object,
      default() {
        return this.data.length > 0 ? this.data[0] : {};
      },
    },
  },
  mounted() {},
  created() {
    this.department = this.initDepartment || {};
  },
  methods: {
    showDepartment() {
      if (this.arrowClass == 'el-icon-caret-top') {
        this.arrowClass = 'el-icon-caret-bottom';
      } else {
        this.arrowClass = 'el-icon-caret-top';
      }
    },
    handleNodeClick(data) {
      this.department = data;
      this.$emit('handleData', data);
      console.log(data);
    },
  },
  watch: {
    // 'data.length': {
    //   handler(newVal) {
    //     if (newVal > 0) {
    //       this.department = this.data[0];
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
};
</script>