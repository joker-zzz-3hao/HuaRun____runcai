<template>
  <div>
    <p>表格树</p>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="date" label="名称" sortable width="180"></el-table-column>
      <el-table-column prop="name" label="负责人" sortable width="180"></el-table-column>
      <el-table-column prop="address" label="目标"></el-table-column>
    </el-table>

    <p>展开行</p>

    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <dl v-for="item in props.row.children" :key="item.id">
            <dd>{{item.date}}</dd>
            <dd>{{item.name}}</dd>
            <dd>{{item.address}}</dd>
          </dl>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="名称" sortable width="180"></el-table-column>
      <el-table-column prop="name" label="负责人" sortable width="180"></el-table-column>
      <el-table-column prop="address" label="目标"></el-table-column>
    </el-table>

    <p>懒加载</p>
    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{
        id: 3,
        date: '润联科技',
        name: '董总',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '华润云',
          name: '肖总',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
            id: 32,
            date: '云门户',
            name: '张聪',
            address: '上海市普陀区金沙江路 1519 弄',
          }],
        }, {
          id: 33,
          date: '智慧技术部',
          name: '刘总',
          address: '上海市普陀区金沙江路 1519 弄',
        }],
      }],
      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hasChildren: true,
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }],
    };
  },
  methods: {
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
          },
        ]);
      }, 1000);
    },
  },
};
</script>