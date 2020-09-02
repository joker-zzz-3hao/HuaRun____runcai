<template>
  <div>
    <el-card v-for="(item,index) in tableList" :key="index" style="margin-top: 20px;">
      <!-- O -->
      <div>
        <tl-oComponent :oData="item"></tl-oComponent>
      </div>
      <hr v-if="item.krList.length> 0" />
      <!-- KR -->
      <div v-for="(kItem,kIndex) in item.krList" :key="kItem.okrDetailConfidence+kIndex">
        <tl-krComponent :krData="kItem"></tl-krComponent>
      </div>
    </el-card>
  </div>
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
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>