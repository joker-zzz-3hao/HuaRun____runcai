<template>
  <div class="teams-weekly">
    <tl-list @showInfo="showInfo" v-show="isList"></tl-list>
    <tl-info
      v-if="!isList"
      @showList="showList"
      :infoParams="infoParams"
    ></tl-info>
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