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
          <el-input v-model="formData.teamName" placeholder="请输入团队名称"></el-input>
        </div>
        <div>
          <div>
            <div>指定团队负责人</div>
            <div v-if="formData.chargeMember.length>0">
              <div>{{formData.chargeMember}}</div>
              <div>
                <i class="el-icon-close" @click="deleteMember(item)"></i>
              </div>
              <!-- <div v-for="item in formData.chargeMember" :key="item.userId">
                <div>{{item.userName}}</div>
                <div>
                  <i class="el-icon-close" @click="deleteMember(item)"></i>
                </div>
              </div>-->
            </div>
            <div v-else>
              <i class="el-icon-plus" @click="showSelectMember=!showSelectMember"></i>
            </div>
          </div>
          <div v-if="showSelectMember">
            <tl-selectMember
              :value="formData.chargeMember"
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
  name: 'editTeam',
  components: {
    'tl-selectMember': selectMember,
  },
  props: {
    teamMembers: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showEditTeam: false,
      formData: {
        teamName: '',
        chargeMember: '',
      },
      showSelectMember: false,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    show(data) {
      this.showEditTeam = true;
      console.log(data);
    },
    getMember(data) {
      this.formData.chargeMember = data;
      this.showSelectMember = false;
    },
    deleteMember() {
      this.formData.chargeMember = '';
    },
    cancel(data) {
      console.log(data);
      this.showSelectMember = false;
    },
    closed() {
      this.showEditTeam = false;
    },
    submitMember() {
      this.server.updateVirtualOrg({

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