<!--
 * @Author: 许志鹏
 * @Date: 2020-08-05 10:45:05
 * @Description: file content
-->
<template>
  <div class="issue-message">
    <div class="rouleflex">
      <div class="roulewidth">
        <el-tree
          class="filter-tree"
          :data="data"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
        ></el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  data() {
    return {
      server,
      filterText: '',
      dialogTableVisible: false,
      roulelist: [],
      data: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    this.getqueryMenu();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = this.getTreeList(res.data, true);
        });
    },
    // 递归修改符合element tree结构数据
    getTreeList(data, disabled) {
      if (data) {
        return data.map((item) => ({
          id: item.functionId,
          label: item.functionName,
          disabled: this.infoBool,
          children: this.getTreeList(item.children, disabled),
        }));
      }
    },
  },
};
</script>
<style  scoped>
.rouleflex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
.roulewidth {
  width: 50%;
}

.rouleselect span:nth-child(2) {
  cursor: pointer;
}

.rouleimg {
  background-color: aquamarine;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 20px;
}

.issue-message {
  height: 300px;
  overflow-y: scroll;
  position: absolute;
  left: 0;
  width: 100%;
  background: #ffffff;
  z-index: 99999;
  top: 50px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>