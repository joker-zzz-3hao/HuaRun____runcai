<template>
  <div style="width: 216px;position: relative;">
    <div v-if="node.node.orgType == '0'">
      <div>{{node.node.orgName}}</div>
      <div>{{node.node.orgLeader || node.node.userName}}</div>
    </div>
    <div
      v-else-if="node.node.orgType == '1'"
      style="position: absolute;top: 0;right: 0;"
      @click="deleteFictitious(node.node)"
    >
      <div>{{node.node.orgName}}</div>
      <div>{{node.node.orgLeader || '未设置'}}</div>
      <i class="el-icon-close"></i>
    </div>
    <div v-else-if="!node.node.orgType && node.node.userName">
      <div>{{node.node.userName}}</div>
    </div>
    <div v-if="node.node.add">
      <div>
        <i class="el-icon-plus" @click="addFictitious"></i>
        <el-cascader-panel
          v-model="fictitiousOrgId"
          :options="orgData"
          v-show="showSelect"
          @change="changePanel"
          :props="{checkStrictly: true,value: 'orgId',label: 'orgName',children: 'sonTree',expandTrigger: 'hover'}"
        ></el-cascader-panel>
      </div>
      <div>添加虚线汇报部门</div>
    </div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();

export default {
  name: 'card',
  components: {},
  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
    userData: {
      type: Object,
      default() {
        return {};
      },
    },
    orgData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      server,
      percentage: 20,
      customColor: '#409eff',
      showSelect: false,
      fictitiousOrgId: '',
    };
  },
  mounted() {},
  computed: {},
  methods: {
    addFictitious() {
      this.showSelect = !this.showSelect;
    },
    changePanel(data) {
      if (data.length > 0) {
        this.showSelect = false;
        this.server.addReportRelation({
          userId: this.userData.userId,
          orgId: data[data.length - 1],
        }).then((res) => {
          if (res.code == '200') {
            this.$emit('addFictitiousSuccess');
          }
        });
      }
    },
    deleteFictitious(data) {
      this.server.updateReportRelation({
        orgId: data.orgId,
        userId: data.parentId,
      }).then((res) => {
        if (res.code == '200') {
          this.$emit('deleteSuccess');
        }
      });
    },
  },
  watch: {},
};
</script>
