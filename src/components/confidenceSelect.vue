<template>
  <div>
    <el-popover
      placement="bottom"
      width="200"
      trigger="click"
      :append-to-body="false"
      v-model="visible"
    >
      <ul>
        <li v-for="citem in CONST.CONFIDENCE" :key="citem.value">
          <div @click="handleClick(citem.value)">
            <div v-for="item in new Array(3)" :key="item">
              <tl-riskStatus :status="citem.value"></tl-riskStatus>
            </div>
            <span>{{citem.label}}</span>
          </div>
        </li>
      </ul>
      <div slot="reference">
        <div v-for="item in new Array(3)" :key="item">
          <tl-riskStatus :status="modelVal"></tl-riskStatus>
        </div>
        <span>{{CONST.CONFIDENCE_MAP[modelVal]}}</span>
      </div>
    </el-popover>
  </div>
</template>

<script>

import riskStatus from '@/components/riskStatus';
import CONST from './const';

export default {
  name: 'confidenceSelect',
  components: {
    'tl-riskStatus': riskStatus,
  },
  data() {
    return {
      CONST,
      visible: false,
    };
  },
  model: {
    prop: 'modelVal', // 指向props的参数名
    event: 'change', // 事件名称
  },
  props: {
    modelVal: {
      type: String,
      default: '1',
    },
  },
  methods: {
    handleClick(value) {
      this.$emit('change', value);
      this.visible = false;
    },
  },
};
</script>

<style>
</style>