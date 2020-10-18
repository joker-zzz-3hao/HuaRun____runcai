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
          <dd>
            <el-input
              v-model="formData.orgName"
              placeholder="请输入组织名称"
              class="tl-input"
            ></el-input>
          </dd>
          <dd v-if="formData.chargeMember && formData.chargeMember.orgLeader">
            <em>{{ formData.chargeMember.orgLeader }}</em>
            <i class="el-icon-close" @click="deleteMember"></i>
          </dd>
          <dd v-else>
            <i
              class="el-icon-plus"
              @click="showSelectMember = !showSelectMember"
            ></i>
          </dd>
        </dl>
        <!-- <div>
          <div>
            <span></span>

          </div>
          <div>
            <div>
              <div></div>
              <div

              >
                <div></div>
                <div>

                </div>
              </div>
              <div v-else>

              </div>
            </div>
            <div v-if="showSelectMember">
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
        </div> -->
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
    drawerTitle: {
      type: String,
      default: '编辑虚拟组织',
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
      this.server.updateVirtualOrg({
        orgName: this.formData.orgName,
        orgId: this.data.orgId,
        roleCode: 'ORG_ADMIN',
        userId: this.formData.chargeMember.userId,
        virtualOrgUser: this.virtualOrgUser,
      }).then((res) => {
        if (res.code == '200') {
          this.close();
          this.$emit('success');
        }
      });
    },
  },
  watch: {},
};
</script>