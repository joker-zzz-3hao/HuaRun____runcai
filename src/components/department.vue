<template>
  <div>
    <div>
      <div>{{department.label}}</div>
    </div>
    <div>
      <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
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
      data: [],
      department: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id',
      },
    };
  },
  mounted() {
    const self = this;
    self.init();
  },
  methods: {
    init() {
      const self = this;
      self.server.getDepartmentList().then((res) => {
        self.data = res.data;
        if (self.data.length > 0) {
          self.department = res.data[0];
        }
      });
    },
    handleNodeClick(data) {
      this.department = data;
      console.log(data);
    },
  },
};
</script>