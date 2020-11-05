<template>
  <div class="footer-panel">
    <el-button
      type="primary"
      @click="submit"
      :loading="submitLoad"
      class="tl-btn amt-bg-slip"
      >{{ btnText }}</el-button
    >
    <el-button
      plain
      @click="save"
      :loading="saveLoad"
      class="tl-btn amt-border-fadeout"
      >保存</el-button
    >
    <el-button plain @click="handleDeleteOne" class="tl-btn amt-border-fadeout"
      >关闭</el-button
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      saveLoad: false,
      submitLoad: false,
    };
  },
  props: ['btnText'],
  methods: {
    submit() {
      this.$emit('submit');
    },
    save() {
      this.$emit('save');
    },
    handleDeleteOne() {
      this.$emit('handleDeleteOne');
    },
  },
};
</script>