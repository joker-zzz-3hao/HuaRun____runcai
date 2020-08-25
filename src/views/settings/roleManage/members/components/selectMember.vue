<template>
  <div class="tl-item-cont">
    <el-input
      placeholder="输入用户名称/LDAP账号"
      minlength="64"
      @keyup.native="fuzzyQueryUser()"
      v-model="keyWord"
      class="tl-input-search"
    >
      <i class="el-icon-search" slot="prefix"></i>
    </el-input>
    <div class="tl-transfer-select">
      <div class="select-target">
        <div class="transfer-head">
          <div class="crumbs">
            <em>润联科技</em>
            <em :class="{'is-subset': true}">华润云</em>
            <em>云门户</em>
          </div>
        </div>
        <ul class="txt-list">
          <li>
            <em>云门户</em>
            <i class="icon-arrow"></i>
          </li>
        </ul>
      </div>
      <div class="selected-target">
        <div class="transfer-head">
          <div class="selected-number">
            <span>已选</span>
            <em>13</em>人
          </div>
          <div class="clear">清空</div>
        </div>
        <ul class="txt-list">
          <li>
            <div class="img-user">
              <img v-if="false" src="@/assets/images/user/user.jpg" alt />
              <em v-else>哲民</em>
            </div>
            <em>云门户</em>
            <i class="icon-clear"></i>
          </li>
        </ul>
      </div>
      <!-- <div class="roulewidth">
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
      </div>-->
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