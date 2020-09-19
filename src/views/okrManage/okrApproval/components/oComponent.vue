<template>
  <!-- O的内容 -->
  <div>
    <div class="display-flex">
      <div>目标</div>
      <div style="margin-left: 10px;">{{oData.okrDetailObjectKr}}</div>
    </div>
    <div class="display-flex" style="margin-top: 20px;justify-content: space-between;">
      <div>
        <span>权重</span>
        <span style="margin-left: 10px;">{{oData.okrWeight}}%</span>
      </div>
      <div class="display-flex">
        <div>进度</div>
        <div style="margin-left: 10px;">
          <tl-process :data="oData.okrDetailProgress"></tl-process>
        </div>
      </div>
      <div v-if="oData.undertakeOkrVo">
        <span>关联父目标</span>
        <span
          v-if="oData.undertakeOkrVo.undertakeOkrContent"
          style="margin-left: 10px;"
        >{{oData.undertakeOkrVo.undertakeOkrContent}}</span>
        <span v-else>暂无</span>
      </div>
      <div v-else>
        <span>关联父目标</span>
        <span
          v-if="oData.undertakeOkrDto && oData.undertakeOkrDto.undertakeOkrContent"
          style="margin-left: 10px;"
        >{{oData.undertakeOkrDto.undertakeOkrContent}}</span>
        <span v-else>暂无</span>
      </div>
    </div>
  </div>
</template>

<script>
import process from '@/components/process';

export default {
  name: 'oComponent',
  data() {
    return {
    };
  },
  components: {
    'tl-process': process,
  },
  props: {
    oData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style scoped>
.display-flex {
  display: flex;
}
</style>