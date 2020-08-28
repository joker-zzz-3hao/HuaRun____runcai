<template>
  <div class="org">
    <tl-okr-table></tl-okr-table>
  </div>
</template>

<script>
import okrTable from '@/components/okrTable';

export default {
  name: 'orgPage',
  components: {
    'tl-okr-table': okrTable,
  },
  data() {
    return {
    };
  },
  created() {

  },
  methods: {
  },
};
</script>
<style  scoped>
.progress {
  width: 300px;
}
.upDown {
  display: flex;
  flex-direction: column;
}
.org {
  display: flex;
  flex-direction: row;
}
.swiperModel {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
}
.swiperLayout {
  overflow: hidden;
  height: 200px;
}
.listOkr {
  display: flex;
  flex-direction: row;
}
.okrPress {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.swiperList {
  width: 1000px;
  border: 1px solid black;
  padding: 10px;
}
</style>