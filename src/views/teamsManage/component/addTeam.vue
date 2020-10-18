<template>
  <el-drawer
    :visible.sync="showCreateTeam"
    @closed="closed"
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    custom-class="custom-drawer add-teams"
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
              v-model="formData.teamName"
              placeholder="请输入团队名称"
              class="tl-input"
            ></el-input>
          </dd>
        </dl>
        <dl>
          <dt>指定组织负责人</dt>
          <el-select v-model.trim="formData.userId" placeholder="请选择">
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
                <img v-if="item.headerUrl" :src="item.headerUrl" alt />
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
      <el-button type="primary" @click="submitMember" class="tl-btn amt-bg-slip"
        >确定</el-button
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
      default: '创建虚拟组织',
    },
  },
  data() {
    return {
      showCreateTeam: false,
      data: {},
      formData: {
        userId: '',
        teamName: '',
        chargeMember: '',
        chargeMembers: [],
      },
      showSelectMember: false,
      showSelectMembers: false,
      virtualOrgUser: [],
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show(data) {
      this.data = data;
      this.showCreateTeam = true;
    },
    getMember(data) {
      this.formData.chargeMember = this.teamMembers.filter((item) => item.userId == data)[0] || {};
      this.showSelectMember = false;
    },
    getMembers(data) {
      this.formData.chargeMembers = data;
      this.showSelectMembers = false;
    },
    deleteMember() {
      this.formData.chargeMember = {};
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
      this.showCreateTeam = false;
    },
    submitMember() {
      this.formData.chargeMembers.forEach((item) => {
        this.virtualOrgUser.push({
          userId: item.userId,
        });
      });
      this.server.addVirtualOrg({
        orgName: this.formData.teamName,
        orgFullId: this.data.orgFullId,
        orgParentId: this.data.orgId,
        roleCode: 'ORG_ADMIN',
        userId: this.formData.userId,
        virtualOrgUser: this.virtualOrgUser,
      }).then((res) => {
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