<!--
 * @Author: 许志鹏
 * @Date: 2020-08-05 10:45:05
 * @Description: file content
-->
<template>
  <div class="issue-message">
    <el-input
      placeholder="输入用户名称/LDAP账号"
      minlength="64"
      @keyup.native="fuzzyQueryUser()"
      v-model="keyWord"
    >
      <i class="el-icon-search" slot="prefix"></i>
    </el-input>
    <div class="rouleflex">
      <div class="roulewidth">
        <div class="selectTitle">
          <div @click="clearUser">组织架构></div>
          <div v-for="(item,index) in selectList" :key="index" @click="getqueryOrgAndUser(item)">
            {{item.name}}
            >
          </div>
        </div>
        <div>
          <ul>
            <li v-for="(item,index) in data" :key="index" @click="getqueryOrgAndUser(item)">
              <em v-if="item.type=='USER'">
                <el-checkbox @change="checkMember($event,item)" v-model="value[index]">{{item.name}}</el-checkbox>
              </em>
              <em v-else>{{item.name}}</em>
            </li>
          </ul>
        </div>
      </div>
      <div class="roulewidth roulemodel">
        <div class="rouleselect">
          <em>已选{{roulelist.length}}人</em>
          <em @click="clearMember">清空</em>
        </div>
        <div class="roulelist">
          <ul>
            <li v-for="(item,index) in roulelist" :key="index">
              <img src alt class="rouleimg" />
              <em>{{item.userName}}</em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'selectMember',
  data() {
    return {
      server,
      filterText: '',
      dialogTableVisible: false,
      roulelist: [],
      data: [],
      form: {},
      member: '',
      value: [],
      selectList: [],
      keyWord: '',
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    this.getqueryOrgAndUser({});
  },
  methods: {
    clearUser() {
      this.getqueryOrgAndUser({});
      this.selectList = [];
    },
    getqueryOrgAndUser(item) {
      if (item.type == 'USER') return false;
      this.selectList[item.level - 2] = item;
      this.selectList.splice((item.level - 1), this.selectList.length - (item.level - 2));
      this.server.queryOrgAndUser({
        orgId: item.id,
      }).then((res) => {
        if (res.code == 200) {
          this.data = res.data;
        }
      });
    },
    clearMember() {
      this.roulelist = [];
      this.value = this.value.map(() => false);
      this.member = this.roulelist;
      this.$emit('getMember', this.member);
    },
    checkMember(node, data) {
      console.log(data);
      if (node) {
        this.roulelist.push({
          userName: data.name,
          userId: data.id,
          roleId: this.$route.query.roleId,
          orgId: data.parentId,
        });
      } else {
        this.roulelist.forEach((item, index) => {
          if (item.userId == data.id) {
            this.roulelist.splice(index, 1);
          }
        });
      }
      this.member = this.roulelist;
      this.$emit('getMember', this.member);
    },
    getRember(data) {
      this.server.listOrgUser({
        orgId: data.id,
      }).then((res) => {
        this.data = res.data.content.map((item) => ({
          label: item.userName,
          id: item.id,
          type: 'user',
          userId: item.userId,
          orgId: item.orgId,
        }));
      });
    },
    fuzzyQueryUser() {
      this.server.fuzzyQueryUser({
        keyWord: this.keyWord,
      }).then((res) => {
        this.data = res.data.map((item) => ({
          id: item.userId,
          name: item.userName,
          parentId: item.orgId,
          type: 'USER',
        }));
      });
    },

  },

};
</script>
<style  scoped>
.rouleflex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
.roulewidth {
  width: 50%;
}
.rouleselect {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.rouleselect span:nth-child(2) {
  cursor: pointer;
}

.roulemodel {
  padding: 0 25px;
  background: #fff;
}

.roulelist ul li {
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.rouleimg {
  background-color: aquamarine;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 20px;
}

.issue-message {
  height: 300px;
  overflow-y: scroll;
}
.selectTitle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>