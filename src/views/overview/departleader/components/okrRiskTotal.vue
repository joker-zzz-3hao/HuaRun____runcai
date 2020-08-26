<template>
  <div class="okrRiskTotal">
    <tl-echart-page idName="okrRiskTotal" :option="option" :widthHeight="widthHeight"></tl-echart-page>
  </div>
</template>

<script>
import echartPage from '../../component/echartPage';
import Server from '../server';

const server = new Server();
export default {
  name: 'okrRiskTotal',
  data() {
    return {
      option: '',
      widthHeight: '',
      server,
    };
  },
  components: {
    'tl-echart-page': echartPage,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 335, name: '50%' },
              { value: 310, name: '70%' },
              { value: 234, name: '20%' },
              { value: 135, name: '30%' },
              { value: 1548, name: '70%' },
            ],
          },
        ],
      };
      this.widthHeight = {
        width: '400px',
        height: '400px',
      };
    },
  },
};
</script>
<style  scoped>
#okrRiskTotal {
  width: 400px;
  display: block;
  height: 400px;
}
</style>