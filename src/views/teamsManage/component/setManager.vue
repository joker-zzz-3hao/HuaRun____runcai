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
    <el-scrollbar>
      <div class="cont-box">
        <dl>
          <dt>部门名称</dt>
          <dd>{{ baseInfo.orgName }}</dd>
        </dl>
        <dl>
          <dt>角色名称</dt>
          <dd>团队综合管理员</dd>
        </dl>
        <dl>
          <dt>指定团队负责人</dt>
          <dd>
            <el-select
              v-model="formData.manageMember"
              clearable
              filterable
              @clear="clearManage"
              popper-class="tl-select-dropdown set-manage"
              class="tl-select"
            >
              <el-option
                v-for="(item, index) in teamMembers"
                :key="index + item.userId"
                :label="item.userName"
                :value="item.userId"
              >
                <dl>
                  <dt class="user-info">
                    <div class="user-name">
                      <img v-if="item.headerUrl" :src="item.headerUrl" alt />
                      <em>{{
                        item.userName.substring(item.userName.length - 2)
                      }}</em>
                    </div>
                  </dt>
                  <dd>
                    <span>{{ item.userName }}</span>
                    <span v-if="item.userMobile">{{
                      `(${item.userMobile})`
                    }}</span>
                    <el-checkbox
                      v-model="item.checkStatus"
                      class="tl-checkbox"
                    ></el-checkbox>
                  </dd>
                </dl>
              </el-option>
            </el-select>
          </dd>
        </dl>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button type="primary" @click="submitMember" class="tl-btn amt-bg-slip"
        >保存</el-button
      >
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