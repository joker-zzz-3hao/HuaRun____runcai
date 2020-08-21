<template>
  <div>
    <div v-for="(item,index) in tableList" :key="index">
      <!-- O -->
      <div>
        <tl-oComponent :oData="item"></tl-oComponent>
      </div>
      <!-- O历史版本 -->
      <div style="margin-top: 10px;background-color: #999;">
        <div>历史版本</div>
        <tl-oComponent style="margin-top: 10px;"></tl-oComponent>
      </div>
      <hr />
      <!-- KR -->
      <div v-if="item.krList.length>0">
        <div v-for="(krItem,index) in item.krList" :key="index+krItem.okrWeight">
          <div>
            <tl-krComponent :krData="krItem"></tl-krComponent>
          </div>
          <!-- KR历史版本 -->
          <div style="margin-top: 10px;background-color: #999;">
            <div>历史版本</div>
            <tl-krComponent></tl-krComponent>
          </div>
        </div>
      </div>
    </div>
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