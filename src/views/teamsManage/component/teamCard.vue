<template>
  <div>
    <div
      v-if="node.node.orgId!='add'"
      style="width: 216px;height: 160px;display: flex;justify-content: center;align-items: center;position: relative;"
    >
      <div>
        <div>
          <span>{{node.node.orgName}}</span>
          <span>({{node.node.orgType == '0' ? '实' : '虚'}})</span>
        </div>
        <div>
          <div>
            <span>负责人：</span>
            <span v-if="node.node.orgLeader">{{node.node.orgLeader}}</span>
            <span v-else>未设置</span>
          </div>
          <div v-if="node.node.orgType == '1'">
            <i class="el-icon-edit-outline" @click.stop="editTeam"></i>
          </div>
        </div>
      </div>
      <div class="delete-team" v-if="node.node.orgType == '1'">
        <i class="el-icon-close" @click.stop="deleteTeam"></i>
      </div>
    </div>
    <div
      v-else
      style="width: 216px;height: 160px;display:flex;justify-content: center;align-items: center;"
      @click.stop="addTeam"
    >创建虚拟团队</div>
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
<style scoped>
.delete-team {
  position: absolute;
  top: 0;
  right: 0;
}
</style>