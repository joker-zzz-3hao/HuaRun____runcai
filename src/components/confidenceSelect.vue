<template>
  <div>
    <el-popover placement="bottom" width="400" trigger="click" :append-to-body="false">
      <el-radio-group v-model="kitem.okrDetailConfidence">
        <el-radio-button v-for="citem in CONST.CONFIDENCE" :key="citem.value" :label="citem.value">
          <tl-riskStatus :status="toString(citem.value)"></tl-riskStatus>
          {{citem.label}}
        </el-radio-button>
      </el-radio-group>
      <el-button slot="reference">{{CONST.CONFIDENCE_MAP[kitem.okrDetailConfidence]}}</el-button>
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
    };
  },
};
</script>

<style>
</style>