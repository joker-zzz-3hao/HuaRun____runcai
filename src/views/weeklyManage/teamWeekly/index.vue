<!--
  功能：
  作者：王志任
  时间：2020年12月21日 15:39:06
  备注：
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