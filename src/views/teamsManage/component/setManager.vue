<template>
  <div>
    <el-drawer
      title="编辑团队综合管理员"
      :visible.sync="showSetManager"
      :with-header="true"
      @close="closed"
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      class="tl-drawer"
    >
      <div>
        <div>
          <span>部门名称</span>
          <span>{{baseInfo.orgName}}</span>
        </div>
        <div>
          <span>角色名称</span>
          <span>团队综合管理员</span>
        </div>
        <div>
          <div>
            <div>指定团队负责人</div>
            <div v-if="chargeMember.userName">
              <div>{{chargeMember.userName}}</div>
              <div>
                <i class="el-icon-close" @click="deleteMember"></i>
              </div>
            </div>
            <div v-else>
              <i class="el-icon-plus" @click="showSelectMember=!showSelectMember"></i>
            </div>
          </div>
          <div v-if="showSelectMember">
            <tl-selectMember
              :value="chargeMember"
              :teamMembers="teamMembers"
              @ok="getMember"
              @cancel="cancel"
            ></tl-selectMember>
          </div>
        </div>
        <div>
          <el-button @click="submitMember">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import selectMember from '@/components/selectMember';

export default {
  name: 'setManager',
  components: {
    'tl-selectMember': selectMember,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    teamMembers: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showSelectMember: false,
      showSetManager: true,
      chargeMember: {},
      baseInfo: {},
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show(data) {
      const self = this;
      self.baseInfo = data;
      self.chargeMember.userId = data.teamUserId;
      self.chargeMember.userName = data.teamManager;
      self.showSetManager = true;
    },
    closed() {
      this.showSetManager = false;
      this.$emit('closed');
    },
    getMember(data) {
      this.chargeMember = this.teamMembers.filter((item) => item.userId == data)[0] || {};
      this.showSelectMember = false;
    },
    deleteMember() {
      this.chargeMember = {};
    },
    submitMember() {
      this.server.setTeamAdminRole({
        roleCode: 'TEAM_ADMIN',
        orgId: this.baseInfo.orgId,
        newUserId: this.chargeMember.userId,
        userId: this.baseInfo.teamUserId || null,
      }).then((res) => {
        if (res.code == '200') {
          this.showSetManager = false;
          this.$emit('setSuccess');
        }
      });
    },
  },
  watch: {},
};
</script>
<style scoped>
.display-flex {
  display: flex;
}
</style>