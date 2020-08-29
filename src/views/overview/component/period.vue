<template>
  <div class="personPage">
    <el-button v-if="showBack" @click="$router.back()">返回</el-button>
    <el-select v-model="value" placeholder="请选择" @change="selectPeriod">
      <el-option
        v-for="item in options"
        :key="item.periodId"
        :label="item.periodName"
        :value="item.periodId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'personPage',
  components: {
  },
  data() {
    return {
      server,
      options: [],
      value: '',
    };
  },
  props: {
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.getokrQuery();
  },
  methods: {
    getokrQuery() {
      this.server.okrQuery().then((res) => {
        if (res.code == 200) {
          this.options = res.data.content;
          this.value = this.options[0].periodId;
          this.$emit('getPeriod', this.value);
        }
      });
    },
    selectPeriod(value) {
      this.$emit('getPeriod', value);
    },
  },
};
</script>
<style scoped>
.personPage {
  width: 100%;
  height: 100px;
  margin-bottom: 30px;
  background: white;
}
</style>