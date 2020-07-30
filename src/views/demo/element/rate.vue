<template>
<div>

<div class="block">
  <span>可更改icon</span>
  <el-rate
  v-model="value"
  :icon-classes="['el-icon-house','el-icon-house','el-icon-house']"
  void-icon-class="el-icon-house"
>
</el-rate>
</div>

</div>
</template>

<script>
export default {
  data() {
    return {
      value: 0,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    };
  },
};
</script>