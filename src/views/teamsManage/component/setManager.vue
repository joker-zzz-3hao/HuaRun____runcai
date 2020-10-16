<template>
  <el-drawer
    :visible.sync="showSetManager"
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    custom-class="custom-drawer set-manage"
    class="tl-drawer"
    :before-close="close"
    @closed="closed"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">{{ drawerTitle }}</div>
    </div>
    <div>
      <div>
        <div>
          <span>部门名称</span>
          <span>{{ baseInfo.orgName }}</span>
        </div>
        <div>
          <span>角色名称</span>
          <span>团队综合管理员</span>
        </div>
        <div>
          <div>
            <div>指定团队负责人</div>
          </div>
          <div>
            <el-select
              v-model="formData.manageMember"
              clearable
              filterable
              @clear="clearManage"
            >
              <el-option
                v-for="(item, index) in teamMembers"
                :key="index + item.userId"
                :label="item.userName"
                :value="item.userId"
              >
                <dt class="user-info">
                  <div class="user-name">
                    <!-- <img v-if="tItem.headerUrl" :src="item.headerUrl" alt /> -->
                    <!-- <em>{{ item.userName }}</em> -->
                  </div>
                </dt>
                <span>{{ item.userName }}</span>
                <span v-if="item.userMobile">{{ `(${item.userMobile})` }}</span>
                <el-checkbox v-model="item.checkStatus"></el-checkbox>
              </el-option>
            </el-select>
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
</template>

<script>

export default {
  name: 'setManager',
  components: {},
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
    drawerTitle: {
      type: String,
      default: '编辑团队综合管理员',
    },
  },
  data() {
    return {
      showSelectMember: false,
      showSetManager: false,
      chargeMember: {},
      baseInfo: {},
      formData: {
        manageMember: '',
      },
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
      self.formData.manageMember = data.teamUserId;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.showSetManager = false;
    },
    clearManage() {
      this.teamMembers.forEach((item) => {
        item.checkStatus = false;
      });
      this.chargeMember = {};
    },
    submitMember() {
      this.server.setTeamAdminRole({
        roleCode: 'TEAM_ADMIN',
        orgId: this.baseInfo.orgId,
        newUserId: this.chargeMember.userId ? this.chargeMember.userId : '',
        userId: this.baseInfo.teamUserId || null,
      }).then((res) => {
        if (res.code == '200') {
          this.close();
          this.$emit('setSuccess');
        }
      });
    },
  },
  watch: {
    'formData.manageMember': {
      handler(newVal) {
        if (newVal) {
          this.teamMembers.forEach((item) => {
            if (newVal == item.userId) {
              item.checkStatus = true;
            } else {
              item.checkStatus = false;
            }
          });
          this.chargeMember = this.teamMembers.filter((item) => item.userId == newVal)[0] || {};
          this.showSelectMember = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>