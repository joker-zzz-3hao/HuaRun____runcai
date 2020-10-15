<template>
  <div>
    <div class="state-grid">
      <div
        :class="{
          'is-no-risk': value == 1,
          'is-risks': value == 10,
          'is-uncontrollable': value == 20,
        }"
      ></div>
      <div
        :class="{
          'is-risks': value == 10,
          'is-uncontrollable': value == 20,
        }"
      ></div>
      <div
        :class="{
          'is-uncontrollable': value == 20,
        }"
      ></div>
    </div>
    <div class="state-txt">
      {{ PRIORITY_MAP[value] }}
    </div>
  </div>
</template>

<script>

const PRIORITY_MAP = {
  1: '低',
  10: '中',
  20: '高',
};

export default {
  name: 'levelblock',
  data() {
    return { PRIORITY_MAP };
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
  },
};
</script>
