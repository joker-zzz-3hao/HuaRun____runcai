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
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import CONST from './const';

export default {
  name: 'crcloudTable',
  data() {
    return {
      CONST,
      rowDrag: true,
    };
  },
  components: {
    draggable,
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