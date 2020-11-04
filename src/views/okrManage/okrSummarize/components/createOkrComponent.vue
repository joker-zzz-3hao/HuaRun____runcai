<template>
  <ul class="okr-change-list">
    <li v-for="item in tableList" :key="item.okrDetailId">
      <tl-oComponent :oData="item" class="is-o"></tl-oComponent>
      <tl-krComponent
        :krData="kItem"
        v-for="kItem in item.krList"
        :key="kItem.okrDetailId"
        class="is-kr"
      ></tl-krComponent>
    </li>
  </ul>
</template>

<script>
import oComponent from './oComponent';
import krComponent from './krComponent';

export default {
  name: 'createOkrComponent',
  components: {
    'tl-oComponent': oComponent,
    'tl-krComponent': krComponent,
  },
  props: {
    tableList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {},
  methods: {},
  watch: {},
};
</script>