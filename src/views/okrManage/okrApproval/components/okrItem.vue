<template>
  <div>
    <el-card v-for="(item,index) in tableList" :key="index" style="margin-top: 20px;">
      <div v-if="item.okrDetailType == '0'">
        <!-- O -->
        <div>
          <tl-oComponent :oData="item"></tl-oComponent>
        </div>
        <!-- O历史版本 -->
        <div v-if="item.historyOkr" style="margin-top: 10px;background-color: #999;">
          <div>历史版本</div>
          <tl-oComponent :oData="item.historyOkr" style="margin-top: 10px;"></tl-oComponent>
        </div>
      </div>
      <!-- <hr v-if="item.okrDetailType == '0'" /> -->
      <!-- KR -->
      <div v-if="item.okrDetailType == '1'">
        <div>
          <tl-krComponent :krData="item"></tl-krComponent>
        </div>
        <!-- KR历史版本 -->
        <div v-if="item.historyOkr" style="margin-top: 10px;background-color: #999;">
          <div>历史版本</div>
          <tl-krComponent :krData="item.historyOkr"></tl-krComponent>
        </div>
      </div>
    </el-card>
  </div>
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