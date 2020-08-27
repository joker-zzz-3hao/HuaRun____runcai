<template>
  <div class="tl-item-cont">
    <el-input placeholder="输入用户名称/LDAP账号" minlength="64" v-model="keyWord" class="tl-input-search">
      <i class="el-icon-search" slot="prefix"></i>
    </el-input>
    <div class="tl-transfer-select">
      <div class="select-target">
        <el-scrollbar>
          <!-- <el-checkbox-group v-model="checkList"> -->
          <el-radio-group v-model="checkList">
            <el-radio
              :label="item.userId"
              class="tl-checkbox"
              v-for="item in data"
              :key="item.userId"
            >
              <div class="img-user" style="display: flex;">
                <img src="@/assets/images/user/user.jpg" alt />
                <div>{{`${item.userName}(${item.userAccount})`}}</div>
              </div>
            </el-radio>
            <!-- <el-checkbox
              :label="item.userId"
              class="tl-checkbox"
              v-for="item in data"
              :key="item.userId"
            >
              <div class="img-user" style="display: flex;">
                <img src="@/assets/images/user/user.jpg" alt />
                <div>{{`${item.userName}(${item.userAccount})`}}</div>
              </div>
            </el-checkbox>-->
          </el-radio-group>
          <!-- </el-checkbox-group> -->
        </el-scrollbar>
      </div>
    </div>
    <div>
      <el-button @click="ok">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'selectMember',
  data() {
    return {
      keyWord: '',
      checkList: '',
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
      type: String,
      default: '',
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
      // this.resultData = [];
      // this.checkList.forEach((item) => {
      //   this.teamMembers.forEach((tItem) => {
      //     if (tItem.userId == item) {
      //       this.resultData.push(tItem);
      //     }
      //   });
      // });
      this.$emit('ok', this.checkList);
    },
  },
};
</script>