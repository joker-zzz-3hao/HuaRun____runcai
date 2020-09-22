<template>
  <div class="personPage">
    <el-button @click="changeTest">{{testModel?'切换到我的数据':'切换到示例数据'}}</el-button>
    <el-button v-if="$route.query.id" @click="back()">返回</el-button>
    <div class="operating-panel">
      <dl class="dl-item">
        <dt>目标周期</dt>
        <dd>
          <el-select
            v-model="value"
            placeholder="请选择目标周期"
            :popper-append-to-body="true"
            popper-class="tl-select-dropdown"
            class="tl-select"
            @change="selectPeriod"
          >
            <el-option
              v-for="item in options"
              :key="item.periodId"
              :label="item.periodName"
              :value="item.periodId"
            ></el-option>
          </el-select>
        </dd>
      </dl>
    </div>
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
  created() {
    this.setOrg(this.userInfo.orgId);
    this.getokrQuery();
  },
  inject: ['reload'],
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  methods: {
    ...mapMutations('common', ['setOrg', 'changeTestModel']),
    back() {
      this.$router.back();
      this.reload();
    },
    changeTest() {
      const boolTest = !this.testModel;
      this.changeTestModel(boolTest);
      this.reload();
    },
    getokrQuery() {
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.options = res.data;
          if (this.options.length > 0) {
            this.value = this.options.filter((item) => item.checkStatus == '1')[0].periodId || {};
          } else {
            this.value = '';
          }

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