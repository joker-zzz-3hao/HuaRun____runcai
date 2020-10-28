<template>
  <el-drawer
    :visible.sync="showEditTeam"
    @closed="closed"
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    custom-class="custom-drawer edit-teams"
    class="tl-drawer"
    :before-close="close"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">{{ drawerTitle }}</div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
        <dl>
          <dt>组织名称</dt>
          <dd>
            <el-input
              v-model="formData.orgName"
              placeholder="请输入团队名称"
              class="tl-input"
            ></el-input>
          </dd>
        </dl>
        <dl>
          <dt>指定组织负责人</dt>
          <el-select
            v-model="chargeMember.userId"
            placeholder="请选择"
            class="tl-select"
          >
            <el-option
              v-for="(item, index) in teamMembers"
              :key="index + item.userId"
              :label="item.userName"
              :value="item.userId"
            >
              <span>{{ item.userName }}</span>
              <span>{{ item.value }}</span>
            </el-option>
          </el-select>
        </dl>
        <dl>
          <dt>组织成员</dt>
          <dd class="img-list">
            <dl v-for="item in formData.chargeMembers" :key="item.userId">
              <dt class="user-info">
                <img
                  v-if="hasValue(item.headerUrl)"
                  :src="item.headerUrl"
                  alt
                />
                <div class="user-name" v-else>
                  <em>{{ cutName(item.userName) }}</em>
                </div>
                <div class="icon-bg" @click="deleteMembers(item)">
                  <i class="el-icon-close"></i>
                </div>
              </dt>
              <dd>{{ item.userName }}</dd>
            </dl>
            <dl class="add-users">
              <dt
                class="user-info"
                @click="showSelectMembers = !showSelectMembers"
              >
                <div class="user-name">
                  <i class="el-icon-plus"></i>
                </div>
              </dt>
              <dd>添加成员</dd>
              <dd v-if="showSelectMembers" class="select-members">
                <tl-selectMembers
                  :value="formData.chargeMembers"
                  :teamMembers="teamMembers"
                  @ok="getMembers"
                  @cancel="cancel"
                ></tl-selectMembers>
              </dd>
            </dl>
          </dd>
        </dl>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button
        :loading="loading"
        type="primary"
        @click="submitMember"
        class="tl-btn amt-bg-slip"
        >保存</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import selectMembers from '@/components/selectMembers';

export default {
  name: 'editTeam',
  components: {
    'tl-selectMembers': selectMembers,
  },
  props: {
    teamMembers: {
      type: Array,
      default() {
        return [];
      },
    },
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    drawerTitle: {
      type: String,
      default: '编辑虚拟组织',
    },
  },
  data() {
    return {
      showEditTeam: false,
      loading: false,
      data: {},
      formData: {
        orgName: '',
        teamName: '',
        // chargeMember: {},
        chargeMembers: [],
        chargeMembersValue: [],
      },
      showSelectMember: false,
      showSelectMembers: false,
      virtualOrgUser: [],
      chargeMember: {
        userId: '',
      },
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show(data) {
      this.data = data;
      this.formData.orgName = data.orgName;
      this.chargeMember.orgLeader = data.orgLeader;
      this.chargeMember.userId = data.userId;
      this.chargeMembersValue = [];
      this.server.getVirtualOrgUser({ orgId: data.orgId }).then((res) => {
        if (res.code == '200') {
          this.formData.chargeMembers = res.data;
          res.data.forEach((item) => {
            this.formData.chargeMembersValue.push(item.userId);
          });
        }
      });
      this.showEditTeam = true;
    },
    getMember(data) {
      this.chargeMember = this.teamMembers.filter((item) => item.userId == data)[0] || {};
      this.chargeMember.orgLeader = this.chargeMember.userName;
      this.showSelectMember = false;
    },
    getMembers(data) {
      this.formData.chargeMembers = data;
      this.showSelectMembers = false;
    },
    deleteMember() {
      this.chargeMember = {};
    },
    deleteMembers(data) {
      this.formData.chargeMembers.forEach((item, index) => {
        if (item.userId == data.userId) {
          this.formData.chargeMembers.splice(index, 1);
        }
      });
    },
    cancel() {
      this.showSelectMembers = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.showEditTeam = false;
    },
    submitMember() {
      this.formData.chargeMembers.forEach((item) => {
        this.virtualOrgUser.push({
          userId: item.userId,
        });
      });
      this.loading = true;
      this.server.updateVirtualOrg({
        orgName: this.formData.orgName,
        orgId: this.data.orgId,
        roleCode: 'ORG_ADMIN',
        userId: this.chargeMember.userId,
        virtualOrgUser: this.virtualOrgUser,
      }).then((res) => {
        this.loading = false;
        if (res.code == '200') {
          this.close();
          this.$emit('success');
        }
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
  },
  watch: {},
};
</script>