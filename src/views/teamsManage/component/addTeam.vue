<template>
  <div>
    <el-drawer
      title="创建虚拟团队"
      :visible.sync="showCreateTeam"
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
            v-model="formData.teamName"
            placeholder="请输入团队名称"
          ></el-input>
        </div>
        <div>
          <div>
            <div>指定团队负责人</div>
            <div v-if="formData.chargeMember.userName">
              <div>{{ formData.chargeMember.userName }}</div>
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
              :value="formData.chargeMember.userName"
              :teamMembers="teamMembers"
              @ok="getMember"
              @cancel="cancel"
            ></tl-selectMember> -->
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
          </div>
        </div>
        <div>
          <div>
            <div>团队成员</div>
            <div v-if="formData.chargeMembers.length > 0">
              <div v-for="item in formData.chargeMembers" :key="item.userId">
                <div>{{ item.userName }}</div>
                <div>
                  <i class="el-icon-close" @click="deleteMembers(item)"></i>
                </div>
              </div>
            </div>
            <div v-else>
              <i
                class="el-icon-plus"
                @click="showSelectMembers = !showSelectMembers"
              ></i>
            </div>
          </div>
          <div v-if="showSelectMembers">
            <tl-selectMembers
              :value="formData.chargeMembers"
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
    cancel(data) {
      console.log(data);
      this.showSelectMember = false;
    },
    closed() {
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
          this.showCreateTeam = false;
          this.$emit('success');
        }
      });
    },
  },
  watch: {},
};
</script>