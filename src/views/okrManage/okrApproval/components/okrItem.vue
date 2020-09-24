<template>
  <ul class="okr-change-list">
    <template>
      <li
        v-for="(item,index) in tableList"
        :key="index"
        :class="item.okrDetailType == '0'? 'is-o' : 'is-kr'"
      >
        <div v-if="item.okrDetailType == '0'" class="change-group">
          <tl-oComponent :oData="item" :isHistory="item.historyOkr"></tl-oComponent>
          <tl-oComponent
            :oData="item.historyOkr"
            :isHistory="item.historyOkr.historyOkr"
            v-if="item.historyOkr"
            :class="{'befor-change': item.historyOkr}"
          ></tl-oComponent>
        </div>
        <div v-if="item.okrDetailType == '1'" class="change-group">
          <tl-krComponent :krData="item" :isHistory="item.historyOkr"></tl-krComponent>
          <tl-krComponent
            :krData="item.historyOkr"
            v-if="item.historyOkr"
            :isHistory="item.historyOkr.historyOkr"
            :class="{'befor-change': item.historyOkr}"
          ></tl-krComponent>
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
  mounted() {
    console.log(this.tableList);
  },
  computed: {},
  methods: {},
  watch: {},
};
</script>