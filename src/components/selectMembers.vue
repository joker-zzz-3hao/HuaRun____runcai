<template>
  <div class="tl-item-cont">
    <el-input
      placeholder="输入用户名称/LDAP账号"
      minlength="64"
      v-model="keyWord"
      class="tl-input-search"
    >
      <i class="el-icon-search" slot="prefix"></i>
    </el-input>
    <div class="tl-transfer-select">
      <div class="select-target">
        <el-scrollbar>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              :label="item.userId"
              class="tl-checkbox"
              v-for="item in data"
              :key="item.userId"
            >
              <div class="select-user-info">
                <em>{{ item.userName }}</em>
                <em v-if="item.userAccount">({{ item.userAccount }})</em>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
    </div>
    <div class="flex-end">
      <el-button plain class="tl-btn amt-border-fadeout" @click="cancel"
        >取消</el-button
      >
      <el-button type="primary" @click="ok" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'selectMember',
  data() {
    return {
      keyWord: '',
      checkList: [],
    };
  },
  props: {
    teamMembers: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {

    data() {
      let result = [];
      if (this.keyWord) {
        this.teamMembers.forEach((item) => {
          // if (item.userName.indexOf(this.keyWord) > -1 || item.userAccount.indexOf(this.keyWord) > -1) {
          if (item.userName.indexOf(this.keyWord) > -1) {
            result.push(item);
          }
        });
      } else {
        result = this.teamMembers;
      }
      return result;
    },
  },
  mounted() {
    this.checkList = this.value;
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    ok() {
      this.resultData = [];
      this.checkList.forEach((item) => {
        this.teamMembers.forEach((tItem) => {
          if (tItem.userId == item) {
            this.resultData.push(tItem);
          }
        });
      });
      this.$emit('ok', this.resultData);
    },
  },
};
</script>