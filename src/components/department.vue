<template>
  <div>
    <div>
      <div @click="showDepartment">
        <span v-if="type == 'department'">{{department.orgName}}</span>
        <span v-else-if="type == 'cycleListSelect'">{{department.periodName}}</span>
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
export default {
  name: 'department',
  data() {
    return {
      arrowClass: 'el-icon-caret-top',
      department: {},
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
        return {};
      },
    },
    defaultProps: {
      type: Object,
      default() {
        return {};
      },
    },
    // type为cycleListSelect时是周期下拉框组件
    // type为department时是组织下拉框组件
    type: {
      type: String,
      default: '',
    },
  },
  mounted() {},
  created() {},
  methods: {
    showDepartment() {
      if (this.arrowClass == 'el-icon-caret-top') {
        this.arrowClass = 'el-icon-caret-bottom';
      } else {
        this.arrowClass = 'el-icon-caret-top';
      }
    },
    handleNodeClick(data) {
      if (this.type == 'cycleListSelect') {
        if (data.okrCycleType != '0') {
          this.department = data;
          this.$emit('handleData', data);
        }
      } else if (this.type == 'department') {
        this.department = data;
        this.$emit('handleData', data);
      }
      console.log(data);
    },
  },
  watch: {
    'data.length': {
      handler(newVal) {
        if (newVal > 0) {
          if (this.type == 'cycleListSelect') {
            this.data.forEach((item) => {
              if (item.checkStatus == '1') {
                this.department = item.children[0] || {};
              }
            });
            this.$emit('handleData', this.department);
          } else if (this.type == 'department') {
            if (this.initDepartment.children) {
              this.department = this.initDepartment;
            } else {
              this.department = this.data[0] || {};
            }
            this.$emit('handleData', this.department);
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>