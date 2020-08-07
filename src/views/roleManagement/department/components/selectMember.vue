<!--
 * @Author: 许志鹏
 * @Date: 2020-08-05 10:45:05
 * @Description: file content
-->
<template>
  <div class="issue-message">
    <el-input placeholder="输入用户名称/LDAP账号" v-model="filterText"></el-input>
    <div class="rouleflex">
      <div class="roulewidth">
        <el-tabs type="border-card">
          <el-tab-pane label="常用">
            <div class="roulelist">
              <ul>
                <li @click="addSelctRoule(item)">
                  <img src alt class="rouleimg" />
                  <span>张三 (zhangshan25）</span>
                </li>
                <li>
                  <img src alt class="rouleimg" />
                  <span>张三 (zhangshan25）</span>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="部门">
            <el-tree
              class="filter-tree"
              :data="data2"
              default-expand-all
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="roulewidth roulemodel">
        <div class="rouleselect">
          <span>已选1人</span>
          <span>清空</span>
        </div>
        <div class="roulelist">
          <ul>
            <li v-for="(item,index) in roulelist" :key="index">
              <img src alt class="rouleimg" />
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },

  data() {
    return {
      filterText: '',
      dialogTableVisible: false,
      roulelist: [],
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1',
          }, {
            id: 10,
            label: '三级 1-1-2',
          }],
        }],
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1',
        }, {
          id: 6,
          label: '二级 2-2',
        }],
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1',
        }, {
          id: 8,
          label: '二级 3-2',
        }],
      }],
    };
  },
  mounted() {
    this.dialogTableVisible = true;
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
.rouleselect {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.rouleselect span:nth-child(2) {
  cursor: pointer;
}

.roulemodel {
  padding: 0 25px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}

.roulelist ul li {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
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
}
</style>