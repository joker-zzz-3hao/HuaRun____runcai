<template>
  <div class="maps-card">
    <dl v-if="node.node.orgId != 'add'">
      <dt>
        <template v-if="node.node.orgLeader">
          <div class="user-info">
            <img v-if="node.node.headerUrl" :src="node.node.headerUrl" alt />
            <div v-else-if="node.node.orgLeader" class="user-name">
              <em>{{
                node.node.orgLeader.substring(node.node.orgLeader.length - 2)
              }}</em>
            </div>
          </div>
          <em>{{ node.node.orgLeader }}</em>
          <span>(组织负责人)</span>
        </template>
        <span v-else>提示：此组织尚未设置负责人</span>
      </dt>
      <dd class="user-name-txt">
        <span>{{ node.node.orgType == "0" ? "实体组织" : "虚拟组织" }}</span>
        <em>{{ node.node.orgName }}</em>
      </dd>
      <dd v-if="node.node.orgType == '1'" class="is-operational">
        <div class="icon-bg">
          <i class="el-icon-edit-outline" @click.stop="editTeam"></i>
        </div>
        <div class="icon-bg">
          <i class="el-icon-close" @click.stop="deleteTeam"></i>
        </div>
      </dd>
    </dl>
    <div v-else @click.stop="addTeam" class="icon-txt-group">
      <div class="icon-bg-big">
        <i class="el-icon-plus"></i>
      </div>
      <span>创建虚拟组织</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'teamCard',
  components: {},
  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    console.log(this.node);
  },
  computed: {},
  methods: {
    editTeam() {
      this.$emit('editTeam', this.node.node);
    },
    deleteTeam() {
      this.$emit('deleteTeam', this.node.node);
    },
    addTeam() {
      this.$emit('addTeam');
    },
  },
  watch: {},
};
</script>