<template>
  <div>
    <el-dialog
      title="评价详情"
      :visible.sync="showDetail"
      :with-header="true"
      @close="closed"
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      class="tl-drawer"
    >
      <div>
        <div>{{CONST.SCORE_MAP[data.score]}}</div>
        <div>{{data.scoreLabel}}</div>
        <div>{{data.scoreDesc}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CONST from '../../const';

export default {
  name: 'detail',
  data() {
    return {
      CONST,
      showDetail: false,
      data: {},
    };
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  mounted() {},
  computed: {},
  methods: {
    show(data) {
      this.data = data;
      this.showDetail = true;
    },
    closed() {
      this.showDetail = false;
    },
  },
  watch: {},
};
</script>