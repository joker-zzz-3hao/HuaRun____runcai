<template>
  <div class="tl-custom-popover">
    <el-popover
      placement="bottom"
      trigger="click"
      :append-to-body="false"
      v-model="visible"
      :visible-arrow="false"
      @show="show"
      @hide="hide"
    >
      <ul>
        <li
          v-for="citem in CONST.CONFIDENCE"
          :key="citem.value"
          @click="handleClick(citem.value)"
        >
          <div class="state-grid">
            <div
              :class="{
                'is-no-risk': citem.value == 1,
                'is-risks': citem.value == 2,
                'is-uncontrollable': citem.value == 3,
              }"
            ></div>
            <div
              :class="{
                'is-risks': citem.value == 2,
                'is-uncontrollable': citem.value == 3,
              }"
            ></div>
            <div :class="{ 'is-uncontrollable': citem.value == 3 }"></div>
          </div>
          <div class="state-txt">{{ citem.label }}</div>
        </li>
      </ul>
      <div slot="reference">
        <div class="state-grid">
          <div
            :class="{
              'is-no-risk': modelVal == 1,
              'is-risks': modelVal == 2,
              'is-uncontrollable': modelVal == 3,
            }"
          ></div>
          <div
            :class="{
              'is-risks': modelVal == 2,
              'is-uncontrollable': modelVal == 3,
            }"
          ></div>
          <div :class="{ 'is-uncontrollable': modelVal == 3 }"></div>
        </div>
        <div class="state-txt">{{ CONST.CONFIDENCE_MAP[modelVal] }}</div>
        <i class="el-icon-caret-bottom" :class="{ 'is-show': isShow }"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>

import CONST from './const';

export default {
  name: 'confidenceSelect',
  components: {
  },
  data() {
    return {
      CONST,
      visible: false,
      isShow: false,
    };
  },
  model: {
    prop: 'modelVal', // 指向props的参数名
    event: 'change', // 事件名称
  },
  props: {
    modelVal: {
      default: '1',
    },
  },
  methods: {
    handleClick(value) {
      this.$emit('change', value);
      this.visible = false;
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>