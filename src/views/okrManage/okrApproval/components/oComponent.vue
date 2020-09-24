<template>
  <dl>
    <dt class="tag-kind">
      <span class="kind-parent">目标</span>
      <em>{{oData.okrDetailObjectKr}}</em>
      <span v-if="changeType == 'beforchange'">变更前</span>
      <span v-else-if="changeType=='afterchange'">变更后</span>
      <span v-else-if="changeType=='newchange'">新增</span>
    </dt>
    <dd>
      <div>
        <i class="el-icon-medal"></i>
        <span>权重</span>
        <em>{{oData.okrWeight}}%</em>
      </div>
      <div>
        <i class="el-icon-odometer"></i>
        <span>进度</span>
        <tl-process :data="parseInt(oData.okrDetailProgress,10)"></tl-process>
      </div>
      <div>
        <i class="el-icon-attract"></i>
        <span>关联父目标</span>
        <em
          v-if="oData.undertakeOkrDto && oData.undertakeOkrDto.undertakeOkrContent"
        >{{oData.undertakeOkrDto.undertakeOkrContent}}</em>
        <em
          v-else-if="oData.undertakeOkrVo && oData.undertakeOkrVo.undertakeOkrContent"
        >{{oData.undertakeOkrVo.undertakeOkrContent}}</em>
        <em v-else>暂无</em>
      </div>
    </dd>
  </dl>
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
    changeType: {
      type: String,
      default: '',
    },
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
