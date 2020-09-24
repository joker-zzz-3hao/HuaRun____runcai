<template>
  <dl>
    <dt class="tag-kind">
      <span class="kind-child">KR</span>
      <em>{{krData.okrDetailObjectKr}}</em>
      <span v-if="changeType == 'beforchange'">变更前</span>
      <span v-else-if="changeType=='afterchange'">变更后</span>
      <span v-else-if="changeType=='newchange'">新增</span>
    </dt>
    <dd>
      <div>
        <i class="el-icon-medal"></i>
        <span>权重</span>
        <em>{{krData.okrWeight}}%</em>
      </div>
      <div>
        <i class="el-icon-odometer"></i>
        <span>进度</span>
        <tl-process :data="parseInt(krData.okrDetailProgress,10)"></tl-process>
      </div>
      <div>
        <i class="el-icon-bell"></i>
        <span>风险状态</span>
        <div class="state-grid">
          <div
            :class="{'is-no-risk': krData.okrDetailConfidence == 1,
                    'is-risks': krData.okrDetailConfidence == 2,
                    'is-uncontrollable': krData.okrDetailConfidence == 3}"
          ></div>
          <div
            :class="{'is-risks': krData.okrDetailConfidence == 2,
                    'is-uncontrollable': krData.okrDetailConfidence == 3}"
          ></div>
          <div :class="{'is-uncontrollable': krData.okrDetailConfidence == 3}"></div>
        </div>
        <div class="state-txt">{{CONST.CONFIDENCE_MAP[krData.okrDetailConfidence]}}</div>
      </div>
    </dd>
    <dd>
      <div>
        <span>考核指标</span>
        <em>{{krData.checkQuota}}</em>
      </div>
    </dd>
    <dd>
      <div>
        <span>衡量方法</span>
        <em>{{krData.judgeMethod}}</em>
      </div>
    </dd>
  </dl>
</template>

<script>
import process from '@/components/process';
import CONST from '../const';

export default {
  name: 'krComponent',
  data() {
    return {
      CONST,
    };
  },
  components: {
    'tl-process': process,
  },
  props: {
    krData: {
      type: Object,
      default() {
        return {};
      },
    },
    changeType: {
      type: String,
      default: '',
    },
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
