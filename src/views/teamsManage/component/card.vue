<template>
  <div class="maps-card">
    <dl>
      <dt>
        <template v-if="!node.node.orgType && node.node.userName">
          <div class="user-info">
            <img v-if="node.node.headerUrl" :src="node.node.headerUrl" alt />
            <div v-else-if="node.node.orgLeader" class="user-name">
              <em>{{
                node.node.orgLeader.substring(node.node.orgLeader.length - 2)
              }}</em>
            </div>
          </div>
          <em>{{ node.node.userName }}</em>
        </template>
        <template v-if="node.node.orgType == '0'">
          <div class="user-info">
            <img v-if="node.node.headerUrl" :src="node.node.headerUrl" alt />
            <div v-else-if="node.node.orgLeader" class="user-name">
              <em>{{
                node.node.orgLeader.substring(node.node.orgLeader.length - 2)
              }}</em>
            </div>
          </div>
          <em v-if="node.node.orgLeader">{{ node.node.orgLeader }}</em>
          <span v-if="node.node.orgLeader">(组织负责人)</span>
          <span v-else>提示：此组织尚未设置负责人</span>
        </template>
        <template v-if="node.node.add">
          <div @click="addFictitious">
            <el-cascader-panel
              v-model="fictitiousOrgId"
              :options="orgData"
              v-show="showSelect"
              @change="changePanel"
              :props="{
                checkStrictly: true,
                value: 'orgId',
                label: 'orgName',
                children: 'sonTree',
                expandTrigger: 'hover',
              }"
            ></el-cascader-panel>
            <span>添加虚线汇报组织</span>
          </div>
        </template>
        <template v-if="node.node.orgType == '1'">
          <div class="user-info">
            <img v-if="node.node.headerUrl" :src="node.node.headerUrl" alt />
            <div v-else-if="node.node.orgLeader" class="user-name">
              <em>{{
                node.node.orgLeader.substring(node.node.orgLeader.length - 2)
              }}</em>
            </div>
          </div>
          <em v-if="node.node.orgLeader">{{ node.node.orgLeader }}</em>
          <span v-if="node.node.orgLeader">(组织负责人)</span>
          <span v-else>提示：此组织尚未设置负责人</span>
        </template>
      </dt>
      <dd class="user-name-txt">
        <span>{{
          node.node.orgType == "0" ? "实体汇报组织" : "虚线汇报组织"
        }}</span>
        <em>{{ node.node.orgName ? node.node.orgName : "未加入虚拟组织" }}</em>
      </dd>
      <dd
        v-if="node.node.orgType == '1'"
        class="is-operational"
        @click="deleteFictitious(node.node)"
      >
        <div class="icon-bg">
          <i class="el-icon-close"></i>
        </div>
      </dd>
    </dl>
  </div>
  <!-- <div style="width: 216px; position: relative">
    <div v-if="node.node.orgType == '0'">
      <div>{{ node.node.orgName }}</div>
      <div>{{ node.node.orgLeader || node.node.userName }}</div>
      <div>直属上级</div>
    </div>
    <div
      v-else-if="node.node.orgType == '1'"
      style="position: absolute; top: 0; right: 0"
      @click="deleteFictitious(node.node)"
    >
      <div>{{ node.node.orgName }}</div>
      <div>{{ node.node.orgLeader || "未设置" }}</div>
      <i class="el-icon-close"></i>
      <div>虚拟汇报部门</div>
    </div>
    <div v-else-if="!node.node.orgType && node.node.userName">
      <div>{{ node.node.userName }}sdfs</div>
    </div>
    <div v-if="node.node.add">
      <div>
        <i class="el-icon-plus" @click="addFictitious"></i>
        <el-cascader-panel
          v-model="fictitiousOrgId"
          :options="orgData"
          v-show="showSelect"
          @change="changePanel"
          :props="{
            checkStrictly: true,
            value: 'orgId',
            label: 'orgName',
            children: 'sonTree',
            expandTrigger: 'hover',
          }"
        ></el-cascader-panel>
      </div>
      <div>添加虚线汇报部门</div>
    </div>
  </div> -->
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
