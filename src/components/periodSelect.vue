<template>
  <el-select v-model="periodId" placeholder="请选择">
    <el-option-group v-for="group in cycleList" :key="group.label" :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.periodId"
        :label="item.periodName"
        :value="item.periodId"
      ></el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: 'periodSelect',
  data() {
    return {
      cycleList: [{
        label: '当前的OKR周期',
        options: [],
      }, {
        label: '历史OKR周期',
        options: [],
      }],
      periodId: '',
      okrCycle: {},
    };
  },
  props: {
    periodList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {
  },
  methods: {
    init() {
      this.periodList.forEach((item) => {
        // checkStatus为0时是历史周期，1为当前周期
        if (item.checkStatus == '0') {
          this.cycleList.forEach((citem) => {
            if (citem.label == '历史OKR周期') {
              citem.options.push(item);
            }
          });
        } else if (item.checkStatus == '1') {
          this.cycleList.forEach((citem) => {
            if (citem.label == '当前的OKR周期') {
              citem.options.push(item);
            }
            this.periodId = item.periodId;
            this.okrCycle = item;
          });
        }
      });
    },
  },
  watch: {
    periodList: {
      handler(newVal) {
        if (newVal) {
          this.init();
        }
      },
      deep: true,
    },
    periodId: {
      handler(newVal) {
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || this.okrCycle;
          this.$emit('handleData', this.okrCycle);
        }
      },
    },
  },
};
</script>

<style>
</style>