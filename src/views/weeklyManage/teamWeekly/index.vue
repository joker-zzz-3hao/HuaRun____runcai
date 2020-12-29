<!--
 * @Author: your name
 * @Date: 2020-12-29 23:12:40
 * @LastEditTime: 2020-12-29 23:27:59
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \cr-talent-web\src\views\weeklyManage\teamWeekly\index.vue
-->
<template>
  <div>
    <div v-show="isList">
      <tl-list @showInfo="showInfo"></tl-list>
    </div>
    <div v-if="!isList">
      <tl-info @showList="showList" :infoParams="infoParams"></tl-info>
    </div>
  </div>
</template>

<script>
import list from './components/list';
import info from './components/teamWeeklyInfo';

export default {
  name: '',
  components: {
    'tl-list': list,
    'tl-info': info,
  },
  props: {},
  data() {
    return {
      isList: true,
      infoParams: {},
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    showInfo(params) {
      this.infoParams = params;
      this.isList = false;
    },
    showList() {
      this.isList = true;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>