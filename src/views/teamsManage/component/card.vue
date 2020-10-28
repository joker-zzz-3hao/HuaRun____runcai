<template>
  <div
    class="maps-card"
    :class="{
      'is-center': !node.node.orgType && node.node.userName,
      'is-add': node.node.add,
    }"
  >
    <dl>
      <dt>
        <template v-if="!node.node.orgType && node.node.userName">
          <div class="user-info">
            <img
              v-if="hasValue(node.node.headerUrl)"
              :src="node.node.headerUrl"
              alt
            />
            <div v-else-if="node.node.userName" class="user-name">
              <em>{{
                node.node.userName.substring(node.node.userName.length - 2)
              }}</em>
            </div>
          </div>
          <em>{{ node.node.userName }}</em>
        </template>
        <template v-if="node.node.orgType == '0'">
          <div class="user-info">
            <img
              v-if="hasValue(node.node.headerUrl)"
              :src="node.node.headerUrl"
              alt
            />
            <div v-else-if="node.node.orgLeader" class="user-name">
              <em>{{
                node.node.orgLeader.substring(node.node.orgLeader.length - 2)
              }}</em>
            </div>
          </div>
          <em v-if="hasValue(node.node.orgLeader)">{{
            node.node.orgLeader
          }}</em>
          <span v-if="hasValue(node.node.orgLeader)">(组织负责人)</span>
          <span v-else>提示：此组织尚未设置负责人</span>
        </template>
        <template v-if="hasValue(node.node.add)">
          <el-cascader
            v-model="fictitiousOrgId"
            ref="cascader"
            :options="orgData"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              value: 'orgId',
              label: 'orgName',
              children: 'sonTree',
            }"
            @change="changePanel"
            popper-class="tl-cascader-popper set-fictitious"
            class="tl-cascader"
            :class="{ 'is-hide': !showSelect }"
          ></el-cascader>
          <div class="icon-bg" @click="addFictitious">
            <i class="el-icon-plus"></i>
          </div>
          <span>添加虚线汇报组织</span>
        </template>
        <template v-if="node.node.orgType == '1'">
          <div class="user-info">
            <img
              v-if="hasValue(node.node.headerUrl)"
              :src="node.node.headerUrl"
              alt
            />
            <div v-else-if="node.node.orgLeader" class="user-name">
              <em>{{
                node.node.orgLeader.substring(node.node.orgLeader.length - 2)
              }}</em>
            </div>
          </div>
          <em v-if="hasValue(node.node.orgLeader)">{{
            node.node.orgLeader
          }}</em>
          <span v-if="hasValue(node.node.orgLeader)">(组织负责人)</span>
          <span v-else>提示：此组织尚未设置负责人</span>
        </template>
      </dt>
      <dd
        class="user-name-txt"
        v-if="node.node.orgType == '0' || node.node.orgType == '1'"
      >
        <span>{{
          node.node.orgType == "0" ? "实体汇报组织" : "虚线汇报组织"
        }}</span>
        <em>{{ node.node.orgName }}</em>
      </dd>
      <dd
        v-if="node.node.orgType == '1'"
        class="icon-bg is-close"
        @click="deleteFictitious(node.node)"
      >
        <i class="el-icon-close"></i>
      </dd>
    </dl>
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
    orgList: {
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
      flag: false,
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
        this.flag = false;
        // 判断是否和实体组织一样，若一样则不能设置成虚拟部门
        this.orgList.forEach((item) => {
          if (item.orgId == data[data.length - 1]) {
            this.flag = true;
          }
        });
        if (this.flag) {
          this.$message.warning('虚拟汇报部门不能和实体部门一样');
          return;
        }
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
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该虚线汇报部门?',
      }).then(() => {
        this.server.updateReportRelation({
          orgId: data.orgId,
          userId: data.parentId,
        }).then((res) => {
          if (res.code == '200') {
            this.$emit('deleteSuccess');
          }
        });
      });
    },
  },
  watch: {},
};
</script>