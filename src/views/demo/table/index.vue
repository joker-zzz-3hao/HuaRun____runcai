<template>
  <div>
    <table v-if="rowDrag">
      <thead>
        <tr>
          <td v-for="(td,index) in CONST.THEAD_DATA" :key="td.key+index">{{td.value}}</td>
        </tr>
      </thead>
      <draggable v-model="CONST.TABLE_DATA" element="tbody">
        <tr v-for="(tr,index) in CONST.TABLE_DATA" :key="index">
          <td v-for="(value,key,index) in  tr" :key="key+index">{{value}}</td>
        </tr>
      </draggable>
    </table>
    <div v-if="!rowDrag">
      <draggable v-model="CONST.TABLE_DATA" element="tbody">
        <tr v-for="(tr,index) in CONST.TABLE_DATA" :key="index">
          <td v-for="(value,key,index) in  tr" :key="key+index">{{value}}</td>
        </tr>
      </draggable>
    </div>
    <el-input v-model="obj.name"></el-input>
    <el-input v-model="objName"></el-input>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import CONST from './const';
import Server from '../server';

const server = new Server();

export default {
  name: 'crcloudTable',
  data() {
    return {
      CONST,
      server,
      rowDrag: true,
      obj: {
        name: 'chenxiang',
      },
      objName: 'chenxiang',
    };
  },
  components: {
    draggable,
  },
  mounted() {
    // this.server.getMockTable().then((res) => {
    //   console.log(res);
    // });
    // this.server.productClassifyAllInfo().then((res) => {
    //   console.log(res);
    // });
  },
  methods: {
    getColDragData() {},
  },
  watch: {
    // obj: {
    //   deep: true,
    //   handler: (newVal) => {
    //     console.log(newVal.name);
    //   },
    // },
    // objName(newVal) {
    //   console.log(newVal);
    // },
  },
};
</script>
<style scoped>
table {
  border-top: 1px solid grey;
  border-left: 1px solid grey;
}
td {
  width: 100px;
  min-height: 50px;
  border-bottom: 1px solid grey;
  border-right: 1px solid grey;
}
</style>