<template>
  <el-popover placement="left" width="250" trigger="click" @show="getshow">
    <el-button type="text" v-if="removeBtn" @click="remove">移除分组</el-button>
    <el-input
      type="input"
      @input="searchKey"
      v-model="keyWord"
      :placeholder="placeholderText"
    ></el-input>
    <div>
      <el-radio-group v-model="radio" @change="changeLeader">
        <el-radio
          class="radio"
          v-for="(item, index) in userListModel"
          :key="index"
          :label="item.userId || item.projectTeamId"
          >{{ item.userName || item.projectTeamName }}</el-radio
        >
      </el-radio-group>
    </div>
    <el-button type="text" class="tl-btn" slot="reference">{{
      btnText
    }}</el-button>
  </el-popover>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  props: ['placeholderText', 'userList', 'btnText', 'selectId', 'listData', 'removeBtn', 'type'],
  data() {
    return {
      server,
      radio: '',
      keyWord: '',
      userListModel: [],
    };
  },
  mounted() {

  },
  methods: {
    getshow() {
      this.userListModel = this.userList;
      this.radio = this.selectId;
    },
    getSearchFun(list, keyword) {
      this.userListModel = this.userList;
      const userList = list.filter((item) => item.projectTeamName.indexOf(keyword) != -1);
      this.userListModel = userList;
    },
    getSearchUser(list, keyword) {
      this.userListModel = this.userList;
      // eslint-disable-next-line array-callback-return
      const userList = list.filter((item) => {
        if (item.userName) {
          return item.userName.indexOf(keyword) != -1;
        }
      });
      this.userListModel = userList;
    },
    searchKey() {
      if (this.type == 'user') {
        this.getSearchUser(this.userList, this.keyWord);
      } else {
        this.getSearchFun(this.userList, this.keyWord);
      }
    },
    remove() {
      this.$confirm('确认移除分组?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.removeList(this.listData);
      }).catch(() => {
        console.log('取消');
      });
    },
    removeList(row) {
      this.server.delUserProjectTeam({
        userId: row.userId,
        projectId: row.projectId,
        projectTeamId: row.projectTeamId,
      }).then((res) => {
        if (res.code == 200) {
          this.$emit('changeTab');
          this.$message.success('删除成功');
        }
      });
    },
    changeLeader(userId) {
      if (this.type == 'user') {
        this.$emit('getSelectUser', userId);
      } else {
        this.$emit('getSelectId', this.listData, userId);
      }
    },
  },
};
</script>
<style  scoped="">
.radio {
  display: block;
  margin: 20px 0;
}
</style>