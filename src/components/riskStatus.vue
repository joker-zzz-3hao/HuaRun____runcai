<template>
  <div
    :class="{'bg-green': status == '1','bg-yellow': status == '2','bg-red':status == '3'}"
    class="status"
  ></div>
</template>

<script>
export default {
  name: 'riskStatus',
  components: {},
  props: {
    status: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
    };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>