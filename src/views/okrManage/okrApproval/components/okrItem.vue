<template>
  <ul class="okr-change-list">
    <template>
      <li v-for="(item,index) in tableList" :key="index">
        <div v-if="item.okrDetailType == '0'" class="change-group">
          <div>
            <tl-oComponent :oData="item"></tl-oComponent>
          </div>
          <div v-if="item.historyOkr" :class="{'befor-change': item.historyOkr}">
            <tl-oComponent :oData="item.historyOkr"></tl-oComponent>
          </div>
        </div>
        <div v-if="item.okrDetailType == '1'" class="change-group">
          <div>
            <tl-krComponent :krData="item"></tl-krComponent>
          </div>
          <div v-if="item.historyOkr" :class="{'befor-change': item.historyOkr}">
            <tl-krComponent :krData="item.historyOkr"></tl-krComponent>
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>

<script>
import oComponent from './oComponent';
import krComponent from './krComponent';

export default {
  name: 'okrItem',
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
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>