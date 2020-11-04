<template>
  <ul class="okr-change-list">
    <li
      v-for="(item, index) in tableList"
      :key="index"
      :class="item.okrDetailType == '0' ? 'is-o' : 'is-kr'"
    >
      <div v-if="item.okrDetailType == '0'" class="change-group">
        <template v-if="item.historyOkr">
          <tl-oComponent :oData="item" changeType="afterchange"></tl-oComponent>
          <tl-oComponent
            :oData="item.historyOkr"
            changeType="beforchange"
            v-if="item.historyOkr"
            :class="{ 'befor-change': item.historyOkr }"
          ></tl-oComponent>
        </template>
        <template v-else>
          <tl-oComponent
            :oData="item"
            changeType="newchange"
            class="new-change"
          ></tl-oComponent>
        </template>
      </div>
      <div v-if="item.okrDetailType == '1'" class="change-group">
        <template v-if="item.historyOkr">
          <tl-krComponent
            :krData="item"
            changeType="afterchange"
          ></tl-krComponent>
          <tl-krComponent
            :krData="item.historyOkr"
            v-if="item.historyOkr"
            changeType="beforchange"
            :class="{ 'befor-change': item.historyOkr }"
          ></tl-krComponent>
        </template>
        <template v-else>
          <tl-krComponent
            :krData="item"
            changeType="newchange"
            class="new-change"
          ></tl-krComponent>
        </template>
      </div>
    </li>
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
    console.log('888888888888888888888888888888888', this.tableList);
  },
  computed: {},
  methods: {},
  watch: {},
};
</script>