<template>
  <div class="personPage">
    <el-button v-if="showBack&&$route.query.id" @click="$router.back()">返回</el-button>
    <el-select v-model="depart" placeholder="请选择" @change="selectOrg">
      <el-option
        v-for="item in userInfo.orgList"
        :key="item.orgId"
        :label="item.orgName"
        :value="item.orgId"
      ></el-option>
    </el-select>
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
import { mapState, mapMutations } from 'vuex';
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
      depart: '',
    };
  },
  props: {
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.depart = this.userInfo.orgList[0].orgId;
    this.setOrg(this.userInfo.orgList[0].orgId);
    this.getokrQuery();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  methods: {
    ...mapMutations('common', ['setOrg']),
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
    selectOrg(value) {
      this.setOrg(value);
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