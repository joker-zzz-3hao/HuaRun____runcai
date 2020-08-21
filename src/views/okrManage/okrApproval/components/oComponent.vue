<template>
  <!-- O的内容 -->
  <div>
    <div class="display-flex">
      <div>目标</div>
      <div style="margin-left: 10px;">收入100万</div>
    </div>
    <div class="display-flex" style="margin-top: 20px;justify-content: space-between;">
      <div>
        <span>权重</span>
        <span style="margin-left: 10px;">30%</span>
      </div>
      <div class="display-flex">
        <div>进度</div>
        <div style="margin-left: 10px;width: 150px;">
          <el-progress :percentage="50"></el-progress>
        </div>
      </div>
      <div>
        <span>承接自</span>
        <span style="margin-left: 10px;">KR:至少五款产品完成升级</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'oComponent',
  data() {
    return {
    };
  },
  components: {},
  props: {},
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