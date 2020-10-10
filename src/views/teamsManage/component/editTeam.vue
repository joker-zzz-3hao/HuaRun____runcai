<template>
  <div>
    <el-drawer
      title="编辑虚拟团队"
      :visible.sync="showEditTeam"
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
          <span>团队名称</span>
          <el-input
            v-model="formData.orgName"
            placeholder="请输入团队名称"
          ></el-input>
        </div>
        <div>
          <div>
            <div>指定团队负责人</div>
            <div
              v-if="formData.chargeMember && formData.chargeMember.orgLeader"
            >
              <div>{{ formData.chargeMember.orgLeader }}</div>
              <div>
                <i class="el-icon-close" @click="deleteMember"></i>
              </div>
            </div>
            <div v-else>
              <i
                class="el-icon-plus"
                @click="showSelectMember = !showSelectMember"
              ></i>
            </div>
          </div>
          <div v-if="showSelectMember">
            <!-- <tl-selectMember
              :value="formData.chargeMember.userId"
              :teamMembers="teamMembers"
              @ok="getMember"
              @cancel="cancel"
            ></tl-selectMember> -->
            <el-select
              v-model="formData.chargeMember.userId"
              placeholder="请选择"
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
          </div>
        </div>
        <div>
          <div>
            <div>团队成员</div>
            <div>
              <div v-for="item in formData.chargeMembers" :key="item.userId">
                <div>{{ item.userName }}</div>
                <div>
                  <i class="el-icon-close" @click="deleteMembers(item)"></i>
                </div>
              </div>
            </div>
            <div>
              <i
                class="el-icon-plus"
                @click="showSelectMembers = !showSelectMembers"
              ></i>
            </div>
          </div>
          <div v-if="showSelectMembers">
            <tl-selectMembers
              :value="formData.chargeMembersValue"
              :teamMembers="teamMembers"
              @ok="getMembers"
              @cancel="cancel"
            ></tl-selectMembers>
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
// import selectMember from '@/components/selectMember';
import selectMembers from '@/components/selectMembers';

export default {
  name: 'editTeam',
  components: {
    // 'tl-selectMember': selectMember,
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
  },
  data() {
    return {
      showEditTeam: false,
      data: {},
      formData: {
        orgName: '',
        teamName: '',
        chargeMember: {},
        chargeMembers: [],
        chargeMembersValue: [],
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
      this.formData.orgName = data.orgName;
      this.formData.chargeMember.orgLeader = data.orgLeader;
      this.formData.chargeMember.userId = data.userId;
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
      console.log(this.chargeMembersValue);
    },
    getMember(data) {
      this.formData.chargeMember = this.teamMembers.filter((item) => item.userId == data)[0] || {};
      this.formData.chargeMember.orgLeader = this.formData.chargeMember.userName;
      console.log(this.formData.chargeMember);
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
    cancel(data) {
      console.log(data);
      this.showSelectMember = false;
    },
    closed() {
      this.showEditTeam = false;
    },
    submitMember() {
      this.formData.chargeMembers.forEach((item) => {
        this.virtualOrgUser.push({
          userId: item.userId,
        });
      });
      this.server.updateVirtualOrg({
        orgName: this.formData.orgName,
        orgId: this.data.orgId,
        roleCode: 'ORG_ADMIN',
        userId: this.formData.chargeMember.userId,
        virtualOrgUser: this.virtualOrgUser,
      }).then((res) => {
        if (res.code == '200') {
          this.showEditTeam = false;
          this.$emit('success');
        }
      });
    },
  },
  watch: {},
};
</script>